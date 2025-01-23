import { InventoryEntry, Prisma, Order, LogEntry } from "@prisma/client";
import { Event } from "./events";
import { nextFreeInventoryEntryId } from "./inventories";
import { distributeRoundRobin } from "./round-robin";
import { handleNotification } from "@/app/notification-settings/page";
import { convertDates } from "@/components/helpers";

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

export interface SimulationEntityState {
  locations: LocationFull[];
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
 * Extended InventoryEntry (runtime) with arrivedTick/leftTick.
 */
export type InventoryEntryWithDelay = InventoryEntry & {
  arrivedTick?: number;
  leftTick?: number;
};

/**
 * Ephemeral structure to store "work in progress" in a ProcessStep:
 * We also reuse it for no-recipe steps (like a "holding pattern").
 */
interface ProcessStepProduction {
  /** The orders involved in the current run (IDs). */
  affectedOrderIds: number[];

  /** When does this production (or holding) finish? Tick number. */
  finishTick: number;

  /** For recipe steps: how many items are produced upon completion. */
  itemsProducedPerRun: number;

  /** For no-recipe steps: how many raw items we’re just holding, if needed. */
  rawItems?: InventoryEntryWithDelay[];

  /** The recipe outputs we create (if recipe-based). */
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
  private notificationsEnabled: boolean = false;
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

    // Initialize first frame at tick=0
    this.frames.push({
      state: Simulation.cloneState(this.currentState),
      tick: this.currentTick,
      orders: Simulation.cloneOrders(this.orders),
    });
  }

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
    this.frames = [
      {
        state: Simulation.cloneState(this.currentState),
        tick: 0,
        orders: Simulation.cloneOrders(this.orders),
      },
    ];
    this.futureFrames = [];
    this.events.length = 0;
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
        // Too far back => reset
        this.reset();
      }
    }
  }

  public tickForward(): void {
    const nextTick = this.currentTick + 1;
    const nextFrame = this.futureFrames.find((f) => f.tick === nextTick);

    if (nextFrame) {
      this.currentTick = nextFrame.tick;
      this.currentState = Simulation.cloneState(nextFrame.state);
      this.frames.push(nextFrame);
      this.futureFrames = this.futureFrames.filter((f) => f.tick > nextTick);
    } else {
      // Compute a new state from the old one
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

    // If no active orders, stop
    if (!this.hasActiveOrders() && !this.isStopped) {
      this.handleSimulationStop();
    }
  }

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

  // --------------------------------------------------------
  //                  computeNextTick
  // --------------------------------------------------------
  private computeNextTick(
    oldState: SimulationEntityState
  ): SimulationEntityState {
    let newState = Simulation.cloneState(oldState);
    Simulation.objectsToReferences(newState);

    // Attach ephemeral arrays
    for (const loc of newState.locations) {
      for (const ps of loc.processSteps) {
        (ps as any).__ongoingProduction = (ps as any).__ongoingProduction || [];
      }
    }

    // 1) Possibly handle new orders
    this.handleOrders(newState);

    if (!this.hasActiveOrders()) {
      return newState;
    }

    // Maps to store durations
    const tsDurationMap: Record<string, number[]> = {};
    const psDurationMap: Record<string, number[]> = {};

    const movedOrderIds = new Set<number>();
    const activeOrderIds = new Set(
      this.orders
        .filter((o) => o.status === "in_progress" || o.status === "pending")
        .map((o) => o.id)
    );

    // (A) Recipe-based steps
    for (const location of newState.locations) {
      for (const ps of location.processSteps) {
        if (!ps.active) continue;
        if (!ps.recipe) continue;

        // ephemeralProd array
        const ephemeralProd = (ps as any)
          .__ongoingProduction as ProcessStepProduction[];

        // finalize if done
        if (ephemeralProd.length > 0) {
          const currentProd = ephemeralProd[0];
          if (this.currentTick >= currentProd.finishTick) {
            this.finalizeProductionRun(
              ps,
              newState,
              currentProd,
              movedOrderIds
            );
            ephemeralProd.shift();
          }
        }

        // try to start new production
        if (ephemeralProd.length === 0) {
          const itemsConsumedPerRun = ps.recipe.inputs
            .map((o) => o.quantity)
            .reduce((acc, cur) => acc + cur, 0);
          const itemsProducedPerRun = ps.recipe.outputs
            .map((o) => o.quantity)
            .reduce((acc, cur) => acc + cur, 0);
          const capacityCheck = itemsProducedPerRun - itemsConsumedPerRun;

          for (
            let r = 0;
            r < ps.recipeRate &&
            ps.inventory.entries.length + capacityCheck <= ps.inventory.limit;
            r++
          ) {
            let inputsFulfilled = true;
            const inputEntries: InventoryEntry[] = [];

            // 1) Gather the needed inputs
            for (const recipeInput of ps.recipe.inputs) {
              const possible: InventoryEntry[] = [];
              for (const entry of ps.inventory.entries) {
                if (
                  recipeInput.material === entry.material &&
                  entry.orderId &&
                  activeOrderIds.has(entry.orderId)
                ) {
                  possible.push(entry);
                }
                if (possible.length >= recipeInput.quantity) break;
              }
              if (possible.length >= recipeInput.quantity) {
                inputEntries.push(...possible);
              } else {
                inputsFulfilled = false;
                break;
              }
            }

            // 2) If inputs are available...
            if (inputsFulfilled) {
              // 2a) **Check errorRate**; for now we always succeed
              if (!this.productionSucceeds(ps)) {
                // If production fails, do nothing for now
                // (We'll expand logic here later)
              } else {
                // measure immediate "transformStart" (old approach)
                const transformStart = Math.min(
                  ...inputEntries.map(
                    (xx) =>
                      (xx as InventoryEntryWithDelay).arrivedTick ??
                      this.currentTick
                  )
                );
                const transformationDuration =
                  this.currentTick - transformStart;

                // record in psDurationMap (for KPI)
                if (!psDurationMap[ps.name]) {
                  psDurationMap[ps.name] = [];
                }
                psDurationMap[ps.name].push(
                  Math.max(0, transformationDuration)
                );

                // remove the input items from this PS's inventory
                const inputSet = new Set(inputEntries);
                ps.inventory.entries = ps.inventory.entries.filter(
                  (e) => !inputSet.has(e)
                );

                // schedule production
                const finishTick = this.currentTick + (ps.duration || 1);
                ephemeralProd.push({
                  finishTick,
                  affectedOrderIds: Array.from(
                    new Set(inputEntries.map((e) => e.orderId))
                  ).filter((x): x is number => x !== null && x !== undefined),
                  itemsProducedPerRun,
                  recipeOutputs: ps.recipe.outputs.map((o) => ({
                    material: o.material,
                    quantity: o.quantity,
                  })),
                });
              }
            }
          }
        }
      }
    }

    // -----------------------------
    //  (B) No-recipe steps
    // -----------------------------
    for (const location of newState.locations) {
      for (const ps of location.processSteps) {
        if (!ps.active) continue;
        if (ps.recipe) continue;

        // ephemeral array
        const ephemeralProd = (ps as any)
          .__ongoingProduction as ProcessStepProduction[];

        // finalize if ongoing
        if (ephemeralProd.length > 0) {
          const currentProd = ephemeralProd[0];
          if (this.currentTick >= currentProd.finishTick) {
            // finalize
            this.finalizeNoRecipe(ps, currentProd, psDurationMap);
            ephemeralProd.shift();
          }
        }

        // see if new items arrived => start new "holding" run
        if (ephemeralProd.length === 0) {
          const rawItems = [...ps.inventory.entries];
          if (rawItems.length > 0) {
            // we hold them for ps.duration
            const finishTick = this.currentTick + (ps.duration || 1);
            ephemeralProd.push({
              finishTick,
              affectedOrderIds: [], // not used
              itemsProducedPerRun: 0,
              rawItems,
              recipeOutputs: [],
            });
          }
        }
      }
    }

    // -----------------------------
    //  (C) Outlet (PS -> TS)
    // -----------------------------
    for (const location of newState.locations) {
      for (const ps of location.processSteps) {
        if (!ps.active) continue;
        const activeOutputs = ps.outputs.filter((o) => o.active);
        const outputSpeeds = activeOutputs.map((o) =>
          Math.min(ps.outputSpeed, o.inputSpeed)
        );

        const itemsPerOutput = distributeRoundRobin(
          ps.inventory.entries
            .filter(
              (entry) => entry.orderId && activeOrderIds.has(entry.orderId)
            )
            .sort((a, b) => a.addedAt.getTime() - b.addedAt.getTime()),
          outputSpeeds,
          ps.outputs.map((o) =>
            o.filter
              ? (i: InventoryEntry) =>
                  o.filter!.entries.some((fe) => fe.material === i.material)
              : () => true
          )
        );

        for (let i = 0; i < itemsPerOutput.length; i++) {
          const ts = ps.outputs[i];

          if (!this.sensorScan(ps, "scanner", "output", itemsPerOutput[i])) {
            continue;
          }
          if (!this.sensorScan(ts, "scanner", "input", itemsPerOutput[i])) {
            continue;
          }

          const entriesOut = itemsPerOutput[i].map((item) => ({
            ...item,
            addedAt: new Date(),
            inventoryId: ts.inventory.id,
            arrivedTick: this.currentTick,
          })) as InventoryEntryWithDelay[];

          if (
            entriesOut.length + ts.inventory.entries.length <=
            ts.inventory.limit
          ) {
            ts.inventory.entries.push(...entriesOut);
          } else {
            continue;
          }

          const outIds = new Set(entriesOut.map((x) => x.id));
          ps.inventory.entries = ps.inventory.entries.filter(
            (e) => !outIds.has(e.id)
          );

          for (const eo of entriesOut) {
            if (eo.orderId != null) {
              movedOrderIds.add(eo.orderId);
            }
          }
        }
      }
    }

    // -----------------------------
    //  (D) Intake (TS -> PS)
    // -----------------------------
    {
      const sourceAvailability = new Map<number, boolean>();
      for (const location of newState.locations) {
        for (const ps of location.processSteps) {
          if (!ps.active) continue;
          for (const inp of ps.inputs) {
            if (!inp.active || !inp.startStepId) continue;
            if (!sourceAvailability.has(inp.startStepId)) {
              const canExpect = canExpectMoreItemsFromSource(
                newState,
                inp.startStepId,
                activeOrderIds
              );
              sourceAvailability.set(inp.startStepId, canExpect);
            }
          }
        }
      }

      for (const location of newState.locations) {
        for (const ps of location.processSteps) {
          if (!ps.active) continue;
          for (const input of ps.inputs) {
            if (!input.active) continue;
            const capacityNow =
              ps.inventory.limit - ps.inventory.entries.length;
            if (capacityNow <= 0) continue;
            const speedIn = Math.min(ps.inputSpeed, input.outputSpeed);
            if (speedIn <= 0) continue;

            const itemsInTS = input.inventory.entries.filter((entry) => {
              if (!entry.orderId || !activeOrderIds.has(entry.orderId)) {
                return false;
              }
              const delayedEntry = entry as InventoryEntryWithDelay;
              if (delayedEntry.arrivedTick == null) return false;
              const delayNeeded =
                input.transportDelay != null && input.transportDelay >= 0
                  ? input.transportDelay
                  : this.transportDelay;
              return this.currentTick - delayedEntry.arrivedTick >= delayNeeded;
            });

            if (itemsInTS.length === 0) continue;
            if (
              input.minQuantity != null &&
              input.minQuantity > 0 &&
              itemsInTS.length < input.minQuantity
            ) {
              const sourceStepId = input.startStepId ?? -1;
              const sourceEmpty = !sourceAvailability.get(sourceStepId);
              if (!sourceEmpty) {
                continue;
              }
            }

            const finalIntakeCount = Math.min(
              speedIn,
              capacityNow,
              itemsInTS.length
            );
            const finalIntake = itemsInTS
              .sort((a, b) => a.addedAt.getTime() - b.addedAt.getTime())
              .slice(0, finalIntakeCount)
              .map((e) => {
                const leftTick = Math.max(
                  this.currentTick,
                  (e as InventoryEntryWithDelay).arrivedTick ?? this.currentTick
                );
                return {
                  ...e,
                  addedAt: new Date(),
                  inventoryId: ps.inventory.id,
                  leftTick,
                };
              });

            // sensorScan
            if (!this.sensorScan(input, "scanner", "output", finalIntake)) {
              continue;
            }
            if (!this.sensorScan(ps, "scanner", "input", finalIntake)) {
              continue;
            }

            // measure durations for TS
            for (const movedItem of finalIntake) {
              const typed = movedItem as InventoryEntryWithDelay;
              if (typed.arrivedTick != null && typed.leftTick != null) {
                const diff = typed.leftTick - typed.arrivedTick;
                if (diff >= 0) {
                  const tsType = input.type || "Unknown";
                  tsDurationMap[tsType] = tsDurationMap[tsType] || [];
                  tsDurationMap[tsType].push(diff);
                }
              }
            }

            // actual intake
            if (!ps.recipe || this.canIntakeItems(ps, finalIntake)) {
              ps.inventory.entries.push(...finalIntake);
              const intakeIds = new Set(finalIntake.map((x) => x.id));
              input.inventory.entries = input.inventory.entries.filter(
                (e) => !intakeIds.has(e.id)
              );
              for (const movedItem of finalIntake) {
                if (movedItem.orderId != null) {
                  movedOrderIds.add(movedItem.orderId);
                }
              }
            }
          }
        }
      }
    }

    // Helper
    function canExpectMoreItemsFromSource(
      state: SimulationEntityState,
      sourceStepId: number | null | undefined,
      activeOrderIds: Set<number>
    ): boolean {
      if (!sourceStepId) return false;
      const sourceStep = state.locations
        .flatMap((loc) => loc.processSteps)
        .find((procStep) => procStep.id === sourceStepId);
      if (!sourceStep) return false;
      return sourceStep.inventory.entries.some(
        (it) => it.orderId && activeOrderIds.has(it.orderId)
      );
    }

    // 5) final checks
    this.checkAndCompleteOrders(newState);
    this.updateOrderRelationships(newState);

    for (const oid of movedOrderIds) {
      const orderObj = this.orders.find((o) => o.id === oid);
      if (orderObj && orderObj.status === "pending") {
        orderObj.status = "in_progress";
        orderObj.startedAt = new Date();
        orderObj.startedTick = this.currentTick;
        this.notificationsEnabled &&
          handleNotification(
            "Order Status",
            `Order ${orderObj.id} ist jetzt in Bearbeitung (erstes Material bewegt).`,
            "info"
          );
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

  /**
   * Helper method to check if production succeeds
   * based on ps.errorRate. Currently always returns true
   * (i.e. no error), but you can expand later with random logic, etc.
   */
  private productionSucceeds(ps: ProcessStepFull): boolean {
    if (!ps.errorRate) return true;

    return Math.random() > ps.errorRate;
  }

  /**
   * finalizeProductionRun for recipe-based steps
   */
  private finalizeProductionRun(
    ps: ProcessStepFull,
    newState: SimulationEntityState,
    production: ProcessStepProduction,
    movedOrderIds: Set<number>
  ) {
    // increment counter sensor
    this.sensorIncrement(ps, "counter", production.itemsProducedPerRun);

    // produce actual items
    for (const oid of production.affectedOrderIds) {
      for (const out of production.recipeOutputs) {
        for (let i = 0; i < out.quantity; i++) {
          ps.inventory.entries.push({
            id: nextFreeInventoryEntryId(newState),
            addedAt: new Date(),
            inventoryId: ps.inventory.id,
            material: out.material,
            orderId: oid,
          });
        }
      }
      movedOrderIds.add(oid);
    }
    console.log(
      `ProcessStep "${ps.name}" completed a production run with duration = ${ps.duration}. Produced: ${production.itemsProducedPerRun} item(s) for Orders: ${production.affectedOrderIds}`
    );
  }

  /**
   * finalizeNoRecipe for no-recipe steps
   */
  private finalizeNoRecipe(
    ps: ProcessStepFull,
    production: ProcessStepProduction,
    psDurationMap: Record<string, number[]>
  ) {
    // We say each raw item had to wait ps.duration
    const totalWait = ps.duration || 1;
    // We can store that in psDurationMap once or for each item.
    // For better KPI averaging, let's push it as many times as items:
    const itemCount = production.rawItems?.length || 0;
    if (!psDurationMap[ps.name]) {
      psDurationMap[ps.name] = [];
    }
    for (let i = 0; i < itemCount; i++) {
      psDurationMap[ps.name].push(totalWait);
    }

    console.log(
      `ProcessStep "${ps.name}" (no-recipe) waited duration = ${ps.duration}. Items: ${itemCount}`
    );
  }

  // ----------------------------------------------
  //  Sensors & scanning
  // ----------------------------------------------
  private sensorIncrement(
    psOrTS: ProcessStepFull | TransportSystemFull,
    sensorType: string,
    amount: number
  ) {
    if (!("sensors" in psOrTS) || !Array.isArray(psOrTS.sensors)) {
      return;
    }
    const sensor = psOrTS.sensors.find((s) => s.type === sensorType);
    if (sensor) {
      sensor.value += amount;
      console.log(
        `[SENSOR] ${sensor.name} incremented by ${amount}, new value: ${sensor.value}`
      );
    }
  }

  private sensorScan(
    psOrTS: ProcessStepFull | TransportSystemFull,
    sensorType: string,
    direction: "input" | "output",
    items: InventoryEntry[]
  ): boolean {
    if (!("sensors" in psOrTS) || !Array.isArray(psOrTS.sensors)) {
      return true;
    }
    const sensor = psOrTS.sensors.find((s) => s.type === sensorType);
    if (!sensor) {
      return true;
    }

    const isProcessStep = (entity: any): entity is ProcessStepFull =>
      "recipe" in entity;

    for (const i of items) {
      const logEntry: LogEntry = {
        id: sensor.logEntries.length + 1,
        sensorId: sensor.id,
        createdAt: new Date(),
        materialId: i.id,
        materialName: i.material,
        inputType: direction,
        processStepId: isProcessStep(psOrTS) ? psOrTS.id : null,
        transportSystemId: !isProcessStep(psOrTS) ? psOrTS.id : null,
      };
      sensor.logEntries.push(logEntry);
    }
    console.log(
      `[SCAN] ${sensor.name} scanning ${items.length} items as ${direction} => success`
    );
    return true;
  }

  // ----------------------------------------------
  //  Orders logic
  // ----------------------------------------------
  private handleOrders(state: SimulationEntityState): void {
    if (this.orders.length === 0) return;
    const pending = this.orders.filter(
      (o) => o.status === "pending" && o.materialsReserved !== true
    );

    for (const order of pending) {
      const required = this.getRequiredMaterialsForOrder(order);
      if (required) {
        const success = this.reserveMaterialsForOrder(order, required, state);
        if (success) {
          order.materialsReserved = true;
        } else {
          this.notificationsEnabled &&
            handleNotification(
              "Order Reservation",
              `Order ${order.id}: Nicht genügend Materialien reserviert.`,
              "error"
            );
        }
      }
    }
  }

  private getRequiredMaterialsForOrder(
    order: Order & { materialsReserved?: boolean }
  ): { material: string }[] | null {
    if (!order.quantity || order.quantity < 1) return null;
    const baseMaterials = [
      "Seat Structure",
      "Backrest Structure",
      "Seat Foam",
      "Backrest Foam",
      "Headrest",
      "Airbag",
      "Small Part",
      "Seat Cover",
      "Backrest Cover",
    ];
    return baseMaterials.map((m) => ({ material: m }));
  }

  private reserveMaterialsForOrder(
    order: Order & { materialsReserved?: boolean },
    materials: { material: string }[],
    state: SimulationEntityState
  ): boolean {
    let allOk = true;
    for (const mat of materials) {
      let needed = order.quantity;
      for (const loc of state.locations) {
        for (const ps of loc.processSteps) {
          const avail = ps.inventory.entries.filter(
            (e) => e.material === mat.material && !e.orderId
          );
          for (const e of avail) {
            if (needed <= 0) break;
            e.orderId = order.id;
            needed--;
          }
          if (needed <= 0) break;
        }
        if (needed <= 0) break;
      }
      if (needed > 0) {
        allOk = false;
        // revert partial reservations
        for (const loc of state.locations) {
          for (const ps of loc.processSteps) {
            for (const e of ps.inventory.entries) {
              if (e.orderId === order.id && e.material === mat.material) {
                e.orderId = null;
              }
            }
          }
        }
        break;
      }
    }
    return allOk;
  }

  private checkAndCompleteOrders(state: SimulationEntityState): void {
    const shippingIds = state.locations
      .flatMap((l) => l.processSteps)
      .filter((p) => p.name === "Shipping")
      .map((p) => p.inventory.id);

    for (const order of this.orders) {
      if (order.status === "completed") continue;
      const seats = state.locations
        .flatMap((l) => l.processSteps)
        .flatMap((p) => p.inventory.entries)
        .filter(
          (e) =>
            e.orderId === order.id &&
            this.isSeatCompleted(e.material) &&
            shippingIds.includes(e.inventoryId)
        ).length;
      if (seats >= order.quantity) {
        order.status = "completed";
        order.completedAt = new Date();
        order.completedTick = this.currentTick;
        this.notificationsEnabled &&
          handleNotification(
            "Order Completed",
            `Order ${order.id} wurde abgeschlossen.`,
            "success"
          );
      }
    }
  }

  private updateOrderRelationships(state: SimulationEntityState): void {
    const orderMap = new Map<number, Order & { materialsReserved?: boolean }>();
    for (const o of this.orders) {
      orderMap.set(o.id, o);
    }

    for (const loc of state.locations) {
      for (const ps of loc.processSteps) {
        const stepOrderIds = new Set<number>(
          ps.inventory.entries
            .filter((entry) => entry.orderId != null)
            .map((entry) => entry.orderId as number)
        );
        ps.orders = [...stepOrderIds]
          .map((oid) => orderMap.get(oid))
          .filter((o): o is Order => o != null);

        for (const inputTS of ps.inputs) {
          const tsOrderIds = new Set<number>(
            inputTS.inventory.entries
              .filter((entry) => entry.orderId != null)
              .map((entry) => entry.orderId as number)
          );
          inputTS.orders = [...tsOrderIds]
            .map((oid) => orderMap.get(oid))
            .filter((o): o is Order => o != null);
        }

        for (const outputTS of ps.outputs) {
          const tsOrderIds = new Set<number>(
            outputTS.inventory.entries
              .filter((entry) => entry.orderId != null)
              .map((entry) => entry.orderId as number)
          );
          outputTS.orders = [...tsOrderIds]
            .map((oid) => orderMap.get(oid))
            .filter((o): o is Order => o != null);
        }
      }
    }
    console.log("Order relationships updated:", state.locations);
  }

  // ----------------------------
  //  Helper
  // ----------------------------
  private canIntakeItems(
    ps: ProcessStepFull,
    inputItems: InventoryEntryWithDelay[]
  ): boolean {
    const currentEntries = ps.inventory.entries;
    const limit = ps.inventory.limit;
    const newEntries = [...currentEntries, ...inputItems];

    // if no recipe, just capacity check
    if (!ps.recipe) {
      return newEntries.length <= limit;
    }

    // gather required
    const requiredMaterials: Record<string, number> = ps.recipe.inputs.reduce(
      (acc: Record<string, number>, input) => {
        acc[input.material] = (acc[input.material] || 0) + input.quantity;
        return acc;
      },
      {}
    );

    // gather current
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
    this.notificationsEnabled &&
      handleNotification(
        "Simulation Stopped",
        "Alle Orders sind abgeschlossen. Keine weitere Berechnung.",
        "info"
      );
  }

  // Converts references => real pointers
  private static objectsToReferences(state: SimulationEntityState): void {
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
    return orders.map((order) => ({ ...order }));
  }
}
