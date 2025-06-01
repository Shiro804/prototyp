// simulation.ts

import {
  InventoryEntry,
  Prisma,
  Order,
  LogEntry,
  Resource as ResourceModel, // renamed to avoid naming collisions
} from "@prisma/client";
import { Event } from "./events";
import { handleNotification } from "@/app/notification-settings/page";
import { convertDates } from "@/components/helpers";

// ---- Existing helper imports ----
import { SimulationQueueManager } from "./logic/SimulationQueueManager";
import { SimulationResourceManager } from "./logic/SimulationResourceManager";
import { SimulationProductionManager } from "./logic/SimulationProductionManager";
import { SimulationSensorLogger } from "./logic/SimulationSensorLogger";
import { SimulationOrderManager } from "./logic/SimulationOrderManager";
import { SimulationSlotManager } from "./logic/SimulationSlotManager";

// ---- NEW imports for steps (A), (B), (C), (D) ----
import { SimulationStepA } from "./logic/SimulationStepA";
import { SimulationStepB } from "./logic/SimulationStepB";
import { SimulationStepC } from "./logic/SimulationStepC";
import { SimulationStepD } from "./logic/SimulationStepD";

/**
 * An in-memory structure for each bottleneck event.
 */
export interface BottleneckEvent {
  tick: number; // which tick the bottleneck occurred
  name: string; // e.g. the name of the PS/TS
}

/**
 * Prisma Location Type with all relations included.
 */
export type LocationFull = Prisma.LocationGetPayload<{
  include: {
    resources: {
      include: {
        Machine: true;
        Worker: {
          include: {
            workerRoles: true;
          };
        };
      };
    };
    processSteps: {
      include: {
        resources: {
          include: {
            Machine: true;
            Worker: {
              include: {
                workerRoles: true;
              };
            };
          };
        };
        inputs: {
          include: {
            inventory: { include: { entries: true } };
            filter: { include: { entries: true } };
            orders: true;
            sensors: {
              include: {
                logEntries: true;
              };
            };
            resources: true;
          };
        };
        outputs: {
          include: {
            inventory: { include: { entries: true } };
            filter: { include: { entries: true } };
            orders: true;
            sensors: {
              include: {
                logEntries: true;
              };
            };
            resources: true;
          };
        };
        sensors: {
          include: {
            logEntries: true;
          };
        };
        inventory: { include: { entries: true } };
        recipe: {
          include: { inputs: true; outputs: true };
        };
        orders: true;
      };
    };
  };
}>;

export type TransportSystemFull = Prisma.TransportSystemGetPayload<{
  include: {
    inventory: { include: { entries: true } };
    filter: { include: { entries: true } };
    orders: true;
    sensors: {
      include: {
        logEntries: true;
      };
    };
    resources: true;
  };
}>;

export type SensorFull = Prisma.SensorGetPayload<{
  include: {
    logEntries: true;
  };
}>;

export type ProcessStepFull = Prisma.ProcessStepGetPayload<{
  include: {
    resources: {
      include: {
        Machine: true;
        Worker: {
          include: {
            workerRoles: true;
          };
        };
      };
    };
    inputs: {
      include: {
        inventory: { include: { entries: true } };
        filter: { include: { entries: true } };
        orders: true;
        sensors: {
          include: {
            logEntries: true;
          };
        };
        resources: true;
      };
    };
    outputs: {
      include: {
        inventory: { include: { entries: true } };
        filter: { include: { entries: true } };
        orders: true;
        sensors: {
          include: {
            logEntries: true;
          };
        };
        resources: true;
      };
    };
    sensors: {
      include: {
        logEntries: true;
      };
    };
    inventory: { include: { entries: true } };
    recipe: {
      include: { inputs: true; outputs: true };
    };
    orders: true;
  };
}>;

/**
 * The simulation state entity, including a custom array for bottlenecks.
 */
export interface SimulationEntityState {
  locations: LocationFull[];

  /**
   * If you want to store an in-memory array of bottlenecks across ticks,
   * you can define it here. It's optional, but helps keep them in the
   * same state object so you can retrieve them later.
   */
  bottlenecks?: BottleneckEvent[];
}

export interface SimulationFrame {
  state: SimulationEntityState;
  tick: number;
  orders: Order[];
  tsTypeDurations?: Record<string, number[]>;
  processStepDurations?: Record<string, number[]>;
}

export interface SimulationRun {
  frames: SimulationFrame[];
  events: Event[];
}

/**
 * Extended InventoryEntry (runtime) with arrivedTick/leftTick and slotNumber (neu).
 */
export type InventoryEntryWithDelay = InventoryEntry & {
  arrivedTick?: number;
  leftTick?: number;
  slotNumber?: number; // used for "slots" in the inventory
};

/**
 * Ephemeral structure to store "work in progress" in a ProcessStep
 * (including no-recipe steps).
 */
interface ProcessStepProduction {
  affectedOrderIds: number[];
  finishTick: number;
  itemsProducedPerRun: number;
  rawItems?: InventoryEntryWithDelay[];
  recipeOutputs: { material: string; quantity: number }[];
}

/**
 * The main Simulation class.
 */
export class Simulation {
  private readonly events: Event[] = [];
  private orders: (Order & { materialsReserved?: boolean })[] = [];
  private frames: SimulationFrame[] = [];
  private futureFrames: SimulationFrame[] = [];
  private currentTick: number = 0;
  private currentState: SimulationEntityState;
  private isStopped: boolean = false;
  private notificationsEnabled: boolean = true; // we set this true for demonstration
  private initialState: SimulationEntityState;

  // Default Transport-System delay in ticks
  private readonly transportDelay = 1;

  constructor(initialState: SimulationEntityState, initialOrders: Order[]) {
    this.initialState = Simulation.cloneState(initialState);
    this.currentState = Simulation.cloneState(initialState);
    this.orders = initialOrders.map((o) => ({
      ...o,
      materialsReserved: false,
    }));

    // Initialize slot usage if needed
    this.assignInitialSlots(this.currentState);

    // Create bottlenecks array if missing
    if (!this.currentState.bottlenecks) {
      this.currentState.bottlenecks = [];
    }

    // Initial frame
    this.frames.push({
      state: Simulation.cloneState(this.currentState),
      tick: this.currentTick,
      orders: Simulation.cloneOrders(this.orders),
    });
  }

  // --------------- Simulation Controls ---------------
  public getSimulationRun(): SimulationRun {
    return {
      frames: this.frames.concat(this.futureFrames),
      events: this.events,
    };
  }

  public getAllOrders(): Order[] {
    return this.orders;
  }

  public getCurrentTick(): number {
    return this.currentTick;
  }

  public reset(): void {
    this.currentTick = 0;
    this.currentState = Simulation.cloneState(this.initialState);

    // Create bottlenecks array if missing
    if (!this.currentState.bottlenecks) {
      this.currentState.bottlenecks = [];
    }

    // Re-assign slots for pre-existing items
    this.assignInitialSlots(this.currentState);

    this.frames = [
      {
        state: Simulation.cloneState(this.currentState),
        tick: 0,
        orders: Simulation.cloneOrders(this.orders),
      },
    ];
    this.futureFrames = [];
    this.events.length = 0;
    this.isStopped = false;
  }

  public discardFutureFrames(): void {
    this.futureFrames = [];
  }

  public runNext(n: number): void {
    for (let i = 0; i < n; i++) {
      this.tickForward();
    }
  }

  public jumpToTick(targetTick: number): void {
    if (targetTick < 0) {
      targetTick = 0;
    }

    const targetFrame = this.frames.find((f) => f.tick === targetTick);
    if (targetFrame) {
      // Jump back
      this.currentTick = targetFrame.tick;
      this.currentState = Simulation.cloneState(targetFrame.state);
      this.orders = Simulation.cloneOrders(targetFrame.orders);
      this.frames = this.frames.filter((f) => f.tick <= targetTick);
      this.discardFutureFrames();
    } else {
      const lastTick = this.currentTick;
      if (targetTick > lastTick) {
        // Forward
        const missingTicks = targetTick - lastTick;
        this.discardFutureFrames();
        for (let i = 0; i < missingTicks; i++) {
          this.tickForward();
        }
      } else if (targetTick < this.frames[0].tick) {
        this.reset();
      }
    }
  }

  public tickForward(): void {
    const nextTick = this.currentTick + 1;
    const nextFrame = this.futureFrames.find((f) => f.tick === nextTick);

    if (nextFrame) {
      // Load that precomputed frame
      this.currentTick = nextFrame.tick;
      this.currentState = Simulation.cloneState(nextFrame.state);
      this.frames.push(nextFrame);
      this.futureFrames = this.futureFrames.filter((f) => f.tick > nextTick);
    } else {
      // Generate new state
      const newState = this.computeNextTick(this.currentState);
      this.currentTick += 1;
      this.currentState = Simulation.cloneState(newState);

      const newFrame: SimulationFrame = {
        tick: this.currentTick,
        state: Simulation.cloneState(this.currentState),
        orders: Simulation.cloneOrders(this.orders),
      };
      this.frames.push(newFrame);
      console.log("New Frame:", newFrame);
    }

    // Check if everything is done
    if (!this.hasActiveOrders() && !this.isStopped) {
      this.handleSimulationStop();
    }
  }

  // --------------- Toggles ---------------
  public toggleTransportSystem(tsId: number): void {
    const lastFrame = this.frames[this.frames.length - 1];
    const { locations } = lastFrame.state;

    const allSteps = locations.flatMap((loc) => loc.processSteps);
    const allTS = allSteps.flatMap((step) => [...step.inputs, ...step.outputs]);
    const foundTS = allTS.find((ts) => ts.id === tsId);

    if (foundTS) {
      foundTS.active = !foundTS.active;
      console.log(
        `Toggle Transport System: ${foundTS.name} (ID: ${foundTS.id}) -> ${
          foundTS.active ? "Active" : "Inactive"
        }`
      );
    }

    this.discardFutureFrames();
    this.currentState = Simulation.cloneState(lastFrame.state);
  }

  public toggleProcessStep(psId: number): void {
    const lastFrame = this.frames[this.frames.length - 1];
    const { locations } = lastFrame.state;

    const allSteps = locations.flatMap((loc) => loc.processSteps);
    const foundPS = allSteps.find((ps) => ps.id === psId);

    if (foundPS) {
      foundPS.active = !foundPS.active;
      console.log(
        `Toggle ProcessStep: ${foundPS.name} (ID: ${foundPS.id}) -> ${
          foundPS.active ? "Active" : "Inactive"
        }`
      );
    }

    this.discardFutureFrames();
    this.currentState = Simulation.cloneState(lastFrame.state);
  }

  public toggleResource(res: ResourceModel): void {
    const lastFrame = this.frames[this.frames.length - 1];
    const { locations } = lastFrame.state;

    let found = false;

    for (const loc of locations) {
      // Check if the resource is associated with a ProcessStep
      if (res.processStepId) {
        const processStep = loc.processSteps.find(
          (ps) => ps.id === res.processStepId
        );
        if (processStep) {
          const resource = processStep.resources.find((r) => r.id === res.id);
          if (resource) {
            resource.active = !resource.active;
            console.log(
              `Toggle Resource: ${resource.name} (ID: ${resource.id}) -> ${
                resource.active ? "Active" : "Inactive"
              }`
            );
            found = true;
            break;
          }
        }
      }

      // If not found in ProcessSteps, check TransportSystems
      if (!found && res.transportSystemId) {
        const allSteps = locations.flatMap((loc) => loc.processSteps);
        const allTS = allSteps.flatMap((step) => [
          ...step.inputs,
          ...step.outputs,
        ]);
        const transportSystem = allTS.find(
          (ts) => ts.id === res.transportSystemId
        );

        if (transportSystem) {
          const resource = transportSystem.resources.find(
            (r) => r.id === res.id
          );
          if (resource) {
            resource.active = !resource.active;
            console.log(
              `Toggle Resource: ${resource.name} (ID: ${resource.id}) -> ${
                resource.active ? "Active" : "Inactive"
              }`
            );
            found = true;
            break;
          }
        }
      }
    }

    if (found) {
      this.discardFutureFrames();
      this.currentState = Simulation.cloneState(lastFrame.state);
    } else {
      console.log(`Resource with ID ${res.id} not found.`);
    }
  }

  // --------------- computeNextTick ---------------
  private computeNextTick(
    oldState: SimulationEntityState
  ): SimulationEntityState {
    // Clone the state
    let newState = Simulation.cloneState(oldState);
    // Re-link references
    Simulation.objectsToReferences(newState);

    // 1) resource logic
    this.applyResourceLogic(newState);

    // 2) handle new orders
    this.handleOrders(newState);

    if (!this.hasActiveOrders()) {
      return newState;
    }

    // ephemeral arrays for ongoing production
    for (const loc of newState.locations) {
      for (const ps of loc.processSteps) {
        (ps as any).__ongoingProduction = (ps as any).__ongoingProduction || [];
      }
    }

    // Collect durations
    const tsDurationMap: Record<string, number[]> = {};
    const psDurationMap: Record<string, number[]> = {};

    const movedOrderIds = new Set<number>();
    const activeOrderIds = new Set(
      this.orders
        .filter((o) => o.status === "in_progress" || o.status === "pending")
        .map((o) => o.id)
    );

    // [QUEUE CODE] Dequeue from PS & TS, passing currentTick so we can log bottlenecks
    this.dequeueItems(newState, this.currentTick);

    // ---------------- (A) RECIPE STEPS ----------------
    SimulationStepA.handleRecipeSteps(
      newState,
      this.currentTick,
      movedOrderIds,
      activeOrderIds,
      psDurationMap,
      (ps) => this.checkResourceFaulty(ps),
      (ps) => this.productionSucceeds(ps),
      (ps, production) =>
        this.finalizeProductionRun(ps, newState, production, movedOrderIds)
    );

    // ---------------- (B) NO-RECIPE STEPS ----------------
    SimulationStepB.handleNoRecipeSteps(
      newState,
      this.currentTick,
      psDurationMap,
      (ps, production) => this.finalizeNoRecipe(ps, production, psDurationMap)
    );

    // ---------------- (C) OUTLET: PS -> TS ----------------
    SimulationStepC.handleOutlet(
      newState,
      this.currentTick,
      this.notificationsEnabled,
      movedOrderIds,
      activeOrderIds,
      (ps, logType, items) => this.sensorLog(ps, logType, items),
      (ts, logType, items) => this.sensorLog(ts, logType, items)
    );

    // ---------------- (D) INTAKE: TS -> PS ----------------
    SimulationStepD.handleIntake(
      newState,
      this.currentTick,
      this.transportDelay,
      this.notificationsEnabled,
      movedOrderIds,
      activeOrderIds,
      tsDurationMap,
      (tsType, diff) => {
        tsDurationMap[tsType] = tsDurationMap[tsType] || [];
        tsDurationMap[tsType].push(diff);
      },
      (ps, logType, items) => this.sensorLog(ps, logType, items),
      (ts, logType, items) => this.sensorLog(ts, logType, items),
      (ps, inputItems) => this.canIntakeItems(ps, inputItems)
    );

    // final checks
    this.checkAndCompleteOrders(newState);
    this.updateOrderRelationships(newState);

    // If we moved items from pending orders => mark them in_progress
    for (const oid of movedOrderIds) {
      const orderObj = this.orders.find((o) => o.id === oid);
      if (orderObj && orderObj.status === "pending") {
        orderObj.status = "in_progress";
        orderObj.startedAt = new Date();
        orderObj.startedTick = this.currentTick;
        if (this.notificationsEnabled) {
          handleNotification(
            "Order Status",
            `Order ${orderObj.id} is now being processed (first material moved).`,
            "info"
          );
        }
      }
    }

    // Save TS durations
    const lastFrame = this.frames[this.frames.length - 1];
    if (!lastFrame.tsTypeDurations) {
      lastFrame.tsTypeDurations = {};
    }
    for (const [tsType, arr] of Object.entries(tsDurationMap)) {
      lastFrame.tsTypeDurations[tsType] = [
        ...(lastFrame.tsTypeDurations[tsType] || []),
        ...arr,
      ];
    }

    // Save PS durations
    if (!lastFrame.processStepDurations) {
      lastFrame.processStepDurations = {};
    }
    for (const psName of Object.keys(psDurationMap)) {
      lastFrame.processStepDurations[psName] = [
        ...(lastFrame.processStepDurations[psName] || []),
        ...psDurationMap[psName],
      ];
    }

    return newState;
  }

  // --------------- QUEUEING / DEQUEUEING ---------------
  private dequeueItems(newState: SimulationEntityState, currentTick: number) {
    // Delegates to the extracted code, passing currentTick so we can record bottlenecks:
    SimulationQueueManager.dequeueItems(
      newState,
      this.notificationsEnabled,
      currentTick
    );
  }

  // --------------- Resource Logic ---------------
  private applyResourceLogic(newState: SimulationEntityState) {
    // Delegates to the extracted code:
    SimulationResourceManager.applyResourceLogic(newState);
  }

  // --------------- Helper Logic ---------------
  private checkResourceFaulty(
    res: ProcessStepFull | TransportSystemFull
  ): boolean {
    // Delegates to the extracted code:
    return SimulationProductionManager.checkResourceFaulty(res);
  }

  private productionSucceeds(ps: ProcessStepFull): boolean {
    // Delegates to the extracted code:
    return SimulationProductionManager.productionSucceeds(ps);
  }

  private finalizeProductionRun(
    ps: ProcessStepFull,
    newState: SimulationEntityState,
    production: ProcessStepProduction,
    movedOrderIds: Set<number>
  ) {
    // Delegates to the extracted code, passing sensorLog as a callback:
    SimulationProductionManager.finalizeProductionRun(
      ps,
      newState,
      production,
      movedOrderIds,
      (entity, logType, items) => this.sensorLog(entity, logType, items)
    );
  }

  private finalizeNoRecipe(
    ps: ProcessStepFull,
    production: ProcessStepProduction,
    psDurationMap: Record<string, number[]>
  ) {
    // Delegates to the extracted code:
    SimulationProductionManager.finalizeNoRecipe(ps, production, psDurationMap);
  }

  private sensorLog(
    psOrTS: ProcessStepFull | TransportSystemFull,
    logType: "input" | "output" | "product",
    items: InventoryEntryWithDelay[]
  ): boolean {
    // Delegates to the extracted code:
    return SimulationSensorLogger.sensorLog(psOrTS, logType, items);
  }

  private handleOrders(state: SimulationEntityState): void {
    // Delegates to the extracted code:
    SimulationOrderManager.handleOrders(
      this.orders,
      state,
      this.notificationsEnabled
    );
  }

  private getRequiredMaterialsForOrder(
    order: Order & { materialsReserved?: boolean }
  ): { material: string }[] | null {
    // Even though it's private in the manager, we replicate the exact call:
    return (SimulationOrderManager as any).getRequiredMaterialsForOrder(order);
  }

  private reserveMaterialsForOrder(
    order: Order & { materialsReserved?: boolean },
    materials: { material: string }[],
    state: SimulationEntityState
  ): boolean {
    // Delegates to the extracted code:
    return (SimulationOrderManager as any).reserveMaterialsForOrder(
      order,
      materials,
      state,
      this.notificationsEnabled
    );
  }

  private checkAndCompleteOrders(state: SimulationEntityState): void {
    // Delegates to the extracted code:
    SimulationOrderManager.checkAndCompleteOrders(
      this.orders,
      state,
      this.currentTick,
      this.notificationsEnabled
    );
  }

  private updateOrderRelationships(state: SimulationEntityState): void {
    // Delegates to the extracted code:
    SimulationOrderManager.updateOrderRelationships(this.orders, state);
  }

  // --------------- Utility Checks ---------------
  private canIntakeItems(
    ps: ProcessStepFull,
    inputItems: InventoryEntryWithDelay[]
  ): boolean {
    const currentEntries = ps.inventory.entries;
    const limit = ps.inventory.limit;
    const newEntries = [...currentEntries, ...inputItems];

    // if no recipe => capacity check only
    if (!ps.recipe) {
      return newEntries.length <= limit;
    }

    const requiredMaterials: Record<string, number> = ps.recipe.inputs.reduce(
      (acc: Record<string, number>, input) => {
        acc[input.material] = (acc[input.material] || 0) + input.quantity;
        return acc;
      },
      {}
    );

    const currentMaterials: Record<string, number> = newEntries.reduce(
      (acc: Record<string, number>, entry) => {
        acc[entry.material] = (acc[entry.material] || 0) + 1;
        return acc;
      },
      {}
    );

    let remainingRequired = 0;
    for (const [mat, qty] of Object.entries(requiredMaterials)) {
      const currentQty = currentMaterials[mat] || 0;
      const need = Math.max(qty - currentQty, 0);
      remainingRequired += need;
    }

    const availableSlots = limit - newEntries.length;
    return availableSlots >= remainingRequired;
  }

  private isSeatCompleted(material: string): boolean {
    return material === "Complete Seat";
  }

  public hasActiveOrders(): boolean {
    return this.orders.some(
      (o) => o.status === "pending" || o.status === "in_progress"
    );
  }

  private handleSimulationStop(): void {
    this.isStopped = true;
    if (this.notificationsEnabled) {
      handleNotification(
        "Simulation Stopped",
        "Alle Orders sind abgeschlossen. Keine weitere Berechnung.",
        "info"
      );
    }
  }

  // --------------- Assign Slots Logic ---------------
  private static ensureUsedSlotsForInventory(inv: any) {
    // Delegates to the extracted code:
    SimulationSlotManager.ensureUsedSlotsForInventory(inv);
  }

  private assignInitialSlots(state: SimulationEntityState) {
    for (const loc of state.locations) {
      for (const ps of loc.processSteps) {
        Simulation.ensureUsedSlotsForInventory(ps.inventory);
        this.assignSlotsIfNeeded(ps.inventory);

        for (const inp of ps.inputs) {
          Simulation.ensureUsedSlotsForInventory(inp.inventory);
          this.assignSlotsIfNeeded(inp.inventory);
        }
        for (const out of ps.outputs) {
          Simulation.ensureUsedSlotsForInventory(out.inventory);
          this.assignSlotsIfNeeded(out.inventory);
        }
      }
    }
  }

  private assignSlotsIfNeeded(inv: any) {
    const unassigned = inv.entries.filter(
      (e: InventoryEntryWithDelay) => e.slotNumber == null
    );
    if (unassigned.length > 0) {
      Simulation.assignSlots(inv, unassigned);
    }
  }

  // --------------- Internal Tools ---------------
  private static objectsToReferences(state: SimulationEntityState): void {
    // turn TS into references
    const transportSystems = Object.fromEntries(
      state.locations
        .flatMap((l) => l.processSteps)
        .flatMap((ps) => ps.inputs.concat(ps.outputs))
        .filter((ts, i, arr) => arr.map((x) => x.id).indexOf(ts.id) === i)
        .map((ts) => [ts.id, ts])
    );

    for (const loc of state.locations) {
      for (const ps of loc.processSteps) {
        ps.inputs = ps.inputs.map((inp) => transportSystems[inp.id]);
        ps.outputs = ps.outputs.map((out) => transportSystems[out.id]);

        Simulation.ensureUsedSlotsForInventory(ps.inventory);

        // create ephemeral queue if missing
        if (!(ps as any).__queue) {
          (ps as any).__queue = [];
        }

        for (const inp of ps.inputs) {
          Simulation.ensureUsedSlotsForInventory(inp.inventory);
          if (!(inp as any).__queue) {
            (inp as any).__queue = [];
          }
        }
        for (const out of ps.outputs) {
          Simulation.ensureUsedSlotsForInventory(out.inventory);
          if (!(out as any).__queue) {
            (out as any).__queue = [];
          }
        }
      }
    }
  }

  private static cloneState(
    state: SimulationEntityState
  ): SimulationEntityState {
    return JSON.parse(JSON.stringify(state), convertDates);
  }

  private static cloneOrders(
    orders: (Order & { materialsReserved?: boolean })[]
  ): Order[] {
    return orders.map((o) => ({ ...o }));
  }

  /**
   * Finds the next free slot and assigns it to the items
   */
  private static assignSlots(
    inventory: any,
    entries: InventoryEntryWithDelay[]
  ) {
    // Delegates to the extracted code:
    SimulationSlotManager.assignSlots(inventory, entries);
  }

  private static freeSlots(inventory: any, entries: InventoryEntryWithDelay[]) {
    // Delegates to the extracted code:
    SimulationSlotManager.freeSlots(inventory, entries);
  }

  // --------------- Updaters ---------------
  public updateProcessStep(
    psId: number,
    data: {
      errorRate?: number;
      outputSpeed?: number;
      inputSpeed?: number;
      recipeRate?: number;
      duration?: number;
      active?: boolean;
      inventoryLimit?: number;
    }
  ) {
    const lastFrame = this.frames[this.frames.length - 1];
    const { locations } = lastFrame.state;
    const allSteps = locations.flatMap((loc) => loc.processSteps);
    const foundPS = allSteps.find((ps) => ps.id === psId);

    if (foundPS) {
      if (data.errorRate != null) foundPS.errorRate = data.errorRate;
      if (data.outputSpeed != null) foundPS.outputSpeed = data.outputSpeed;
      if (data.inputSpeed != null) foundPS.inputSpeed = data.inputSpeed;
      if (data.recipeRate != null) foundPS.recipeRate = data.recipeRate;
      if (data.duration != null) foundPS.duration = data.duration;
      if (data.active != null) foundPS.active = data.active;

      if (data.inventoryLimit != null && foundPS.inventory) {
        foundPS.inventory.limit = data.inventoryLimit;
      }
      console.log(`ProcessStep ID=${psId} updated with:`, data);
    } else {
      console.log(`ProcessStep ID=${psId} not found for update`);
    }

    this.discardFutureFrames();
    this.currentState = Simulation.cloneState(lastFrame.state);
  }

  public updateTransportSystem(
    tsId: number,
    data: {
      inputSpeed?: number;
      outputSpeed?: number;
      active?: boolean;
      minQuantity?: number;
      transportDelay?: number;
    }
  ) {
    const lastFrame = this.frames[this.frames.length - 1];
    const { locations } = lastFrame.state;
    const allSteps = locations.flatMap((loc) => loc.processSteps);
    const allTS = allSteps.flatMap((step) => [...step.inputs, ...step.outputs]);
    const foundTS = allTS.find((ts) => ts.id === tsId);

    if (foundTS) {
      if (data.inputSpeed != null) foundTS.inputSpeed = data.inputSpeed;
      if (data.outputSpeed != null) foundTS.outputSpeed = data.outputSpeed;
      if (data.active != null) foundTS.active = data.active;
      if (data.minQuantity != null) foundTS.minQuantity = data.minQuantity;
      if (data.transportDelay != null)
        foundTS.transportDelay = data.transportDelay;
      console.log(`TransportSystem ID=${tsId} updated with:`, data);
    } else {
      console.log(`TransportSystem ID=${tsId} not found for update`);
    }

    this.discardFutureFrames();
    this.currentState = Simulation.cloneState(lastFrame.state);
  }

  public updateResource(
    resId: number,
    data: {
      faultyRate?: number;
    }
  ) {
    const lastFrame = this.frames[this.frames.length - 1];
    const { locations } = lastFrame.state;

    let foundRes: ResourceModel | undefined;

    outer: for (const loc of locations) {
      for (const ps of loc.processSteps) {
        const r = ps.resources.find((rr) => rr.id === resId);
        if (r) {
          foundRes = r;
          break outer;
        }
        for (const inpTS of ps.inputs) {
          const rr = inpTS.resources?.find((xx) => xx.id === resId);
          if (rr) {
            foundRes = rr;
            break outer;
          }
        }
        for (const outTS of ps.outputs) {
          const rr = outTS.resources?.find((xx) => xx.id === resId);
          if (rr) {
            foundRes = rr;
            break outer;
          }
        }
      }
    }

    if (foundRes) {
      if (data.faultyRate != null) foundRes.faultyRate = data.faultyRate;
      console.log(`Resource ID=${resId} updated with:`, data);
    } else {
      console.log(`Resource ID=${resId} not found for update`);
    }

    this.discardFutureFrames();
    this.currentState = Simulation.cloneState(lastFrame.state);
  }
}
