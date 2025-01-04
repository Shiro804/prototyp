// Simulation.ts

import { InventoryEntry, Prisma, Order } from "@prisma/client";
import { Event } from "./events";
import { nextFreeInventoryEntryId } from "./inventories";
import { distributeRoundRobin } from "./round-robin";
import { handleNotification } from "@/app/notification-settings/page";

/**
 * Converts date strings ("YYYY-MM-DDTHH:mm:ss.sssZ") to actual Date objects.
 */
export function convertDates(key: string, value: any) {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(value)) return value;
  return new Date(value);
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
          };
        };
        outputs: {
          include: {
            inventory: { include: { entries: true } };
            filter: { include: { entries: true } };
            orders: true;
          };
        };
        sensors: true;
        inventory: { include: { entries: true } };
        recipe: {
          include: { inputs: true; outputs: true };
        };
        orders: true;
      };
    };
  };
}>;

/**
 * The SimulationState contains only Locations.
 */
export interface SimulationEntityState {
  locations: LocationFull[];
}

/**
 * Simulation Frame containing the state and the tick number.
 */
export interface SimulationFrame {
  state: SimulationEntityState;
  tick: number;
  orders: Order[];
}

/**
 * SimulationRun contains all frames and events from the simulation.
 */
export interface SimulationRun {
  frames: SimulationFrame[];
  events: Event[];
}

/**
 * Comprehensive Simulation class combining functionalities of Simulation and SimulationMock.
 */
export class Simulation {
  // --- Private Fields ---

  // Events that occur during the simulation
  private readonly events: Event[] = [];

  // Orders being processed in the simulation
  private orders: (Order & { materialsReserved?: boolean })[] = [];

  // All computed frames of the simulation
  private frames: SimulationFrame[] = [];

  // Future frames precomputed for performance
  private futureFrames: SimulationFrame[] = [];

  // Current tick number
  private currentTick: number = 0;

  // Current state of the simulation
  private currentState: SimulationEntityState;

  // Indicates if the simulation has been stopped
  private isStopped: boolean = false;

  // Controls whether notifications are enabled
  private notificationsEnabled: boolean = false;

  private initialState: SimulationEntityState;

  // --- Constructor ---

  /**
   * Initializes the Simulation with an initial state and orders.
   * @param initialState The initial state of the simulation.
   * @param initialOrders The initial set of orders.
   */
  constructor(initialState: SimulationEntityState, initialOrders: Order[]) {
    this.initialState = Simulation.cloneState(initialState);

    // Clone the initial state to prevent mutations
    this.currentState = Simulation.cloneState(initialState);

    // Clone the initial orders and mark materials as not reserved
    this.orders = initialOrders.map((o) => ({
      ...o,
      materialsReserved: false,
    }));

    // Initialize frames with the initial state as tick 0
    this.frames.push({
      state: Simulation.cloneState(this.currentState),
      tick: this.currentTick,
      orders: Simulation.cloneOrders(this.orders),
    });
  }

  // --- Public Methods ---

  /**
   * Retrieves the entire simulation run, including all frames and events.
   * @returns The complete simulation run.
   */
  public getSimulationRun(): SimulationRun {
    return {
      frames: this.frames.concat(this.futureFrames),
      events: this.events,
    };
  }

  /**
   * Retrieves all orders in the simulation.
   * @returns An array of all orders.
   */
  public getAllOrders(): Order[] {
    return this.orders;
  }

  /**
   * Retrieves the current tick number.
   * @returns The current tick.
   */
  public getCurrentTick(): number {
    return this.currentTick;
  }

  /**
   * Resets the simulation to its initial state, clearing all frames and events.
   */
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

  /**
   * Discards all future frames, effectively stopping any precomputed ticks.
   */
  public discardFutureFrames(): void {
    this.futureFrames = [];
  }

  /**
   * Precomputes the next N ticks starting from the current state.
   * @param n Number of ticks to precompute.
   */
  public runNext(n: number): void {
    for (let i = 0; i < n; i++) {
      this.tickForward();
    }
  }

  /**
   * Jumps the simulation to a specific tick, computing intermediate ticks if necessary.
   * @param targetTick The tick number to jump to.
   */
  public jumpToTick(targetTick: number): void {
    // Clamp negative tick numbers to zero
    if (targetTick < 0) {
      targetTick = 0;
    }

    const targetFrame = this.frames.find((f) => f.tick === targetTick);

    if (targetFrame) {
      // Restore the state and orders from the target frame
      this.currentTick = targetFrame.tick;
      this.currentState = Simulation.cloneState(targetFrame.state);
      this.orders = Simulation.cloneOrders(targetFrame.orders);

      // Remove frames beyond the target tick
      this.frames = this.frames.filter((f) => f.tick <= targetTick);

      // Discard future frames
      this.discardFutureFrames();
    } else {
      // If targetTick > currentMaxTick, compute the missing ticks
      const lastTick = this.currentTick;
      if (targetTick > lastTick) {
        const missingTicks = targetTick - lastTick;
        this.discardFutureFrames();

        for (let i = 0; i < missingTicks; i++) {
          this.tickForward();
        }
      }
      // If targetTick < first tick, reset to initial state
      else if (targetTick < this.frames[0].tick) {
        this.reset();
      }
    }
  }

  /**
   * Advances the simulation by one tick.
   * Utilizes precomputed future frames if available; otherwise, computes on the fly.
   */
  public tickForward(): void {
    const nextTick = this.currentTick + 1;

    // Check if the next tick is already precomputed
    const nextFrame = this.futureFrames.find((f) => f.tick === nextTick);

    if (nextFrame) {
      // Use the precomputed frame
      this.currentTick = nextFrame.tick;
      this.currentState = Simulation.cloneState(nextFrame.state);
      this.frames.push(nextFrame);
      this.futureFrames = this.futureFrames.filter((f) => f.tick > nextTick);
    } else {
      // Compute a new frame on the fly
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

    // Check if all orders are completed
    if (!this.hasActiveOrders() && !this.isStopped) {
      this.handleSimulationStop();
    }
  }

  /**
   * Toggles the active state of a transport system and discards future frames.
   * @param tsId The ID of the transport system to toggle.
   */
  public toggleTransportSystem(tsId: number): void {
    // Find the transport system in the current state
    const allSteps = this.currentState.locations.flatMap(
      (loc) => loc.processSteps
    );
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

    // Discard future frames as the state has changed
    this.discardFutureFrames();
  }

  // --- Private Methods ---

  /**
   * Core logic for computing the next simulation tick.
   * Combines all phases from both Simulation and SimulationMock.
   * @param oldState The current state before the tick.
   * @returns The new state after the tick.
   */
  private computeNextTick(
    oldState: SimulationEntityState
  ): SimulationEntityState {
    let newState = Simulation.cloneState(oldState);
    Simulation.objectsToReferences(newState);

    // Phase 0: Orders (reservation only, no status = "in_progress" here!)
    this.handleOrders(newState);

    // Check if there are still active orders
    if (!this.hasActiveOrders()) {
      return newState;
    }

    // Track which orders have moved items this tick
    const movedOrderIds = new Set<number>();

    // Build a set of active order IDs for filtering
    const activeOrderIds = new Set(
      this.orders
        .filter((o) => o.status === "in_progress" || o.status === "pending")
        .map((o) => o.id)
    );

    // ---------------------
    // Phase 1: Production
    // ---------------------
    for (const location of newState.locations) {
      for (const ps of location.processSteps) {
        if (!ps.recipe) continue;

        const itemsProducedPerRun = ps.recipe.outputs
          .map((o) => o.quantity)
          .reduce((acc, cur) => acc + cur, 0);

        for (
          let r = 0;
          r < ps.recipeRate &&
          ps.inventory.entries.length + itemsProducedPerRun <=
            ps.inventory.limit;
          r++
        ) {
          let inputsFulfilled = true;
          let inputEntries: InventoryEntry[] = [];

          for (const recipeInput of ps.recipe.inputs) {
            let possible: InventoryEntry[] = [];
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

          if (inputsFulfilled) {
            // Identify affected orders
            const affectedOrders = Array.from(
              new Set(inputEntries.map((e) => e.orderId))
            );

            // Remove consumed items
            const inputEntriesSet = new Set(inputEntries);
            ps.inventory.entries = ps.inventory.entries.filter(
              (e) => !inputEntriesSet.has(e)
            );

            // Produce outputs
            for (const out of ps.recipe.outputs) {
              for (let i = 0; i < out.quantity; i++) {
                for (const orderId of affectedOrders) {
                  ps.inventory.entries.push({
                    id: nextFreeInventoryEntryId(newState),
                    addedAt: new Date(),
                    inventoryId: ps.inventory.id,
                    material: out.material,
                    orderId,
                  });
                }
              }
            }

            // Increment transformation counter
            if (ps.totalRecipeTransformations == null) {
              ps.totalRecipeTransformations = 0;
            }
            ps.totalRecipeTransformations++;

            // Mark orders as moved
            for (const oid of affectedOrders) {
              if (oid != null) {
                movedOrderIds.add(oid);
              }
            }

            // Handle notifications
            this.notificationsEnabled &&
              handleNotification(
                ps.name,
                `Live Simulation: ${ps.name}`,
                "Transformation complete"
              );
          }
        }
      }
    }

    // ---------------------
    // Phase 2: Outlet
    // ---------------------
    for (const location of newState.locations) {
      for (const ps of location.processSteps) {
        // Only consider active transportsystems
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
          let ts = ps.outputs[i];
          let entriesOut = itemsPerOutput[i].map((item) => ({
            ...item,
            addedAt: new Date(),
            inventoryId: ts.inventory.id,
          }));
          ts.inventory.entries.push(...entriesOut);

          // Remove from process step inventory
          const outIds = new Set(entriesOut.map((x) => x.id));
          ps.inventory.entries = ps.inventory.entries.filter(
            (e) => !outIds.has(e.id)
          );

          // Mark orders as moved
          for (const eo of entriesOut) {
            if (eo.orderId != null) {
              movedOrderIds.add(eo.orderId);
            }
          }
        }
      }
    }

    // ---------------------
    // Phase 3: Intake
    // ---------------------
    for (const location of newState.locations) {
      for (const ps of location.processSteps) {
        for (const input of ps.inputs) {
          let speedIn = Math.min(ps.inputSpeed, input.outputSpeed);
          let inputItems = input.inventory.entries
            .filter(
              (entry) => entry.orderId && activeOrderIds.has(entry.orderId)
            )
            .sort((a, b) => a.addedAt.getTime() - b.addedAt.getTime())
            .slice(0, speedIn)
            .map((e) => ({
              ...e,
              addedAt: new Date(),
              inventoryId: ps.inventory.id,
            }));

          ps.inventory.entries.push(...inputItems);

          const inputSet = new Set(inputItems.map((x) => x.id));
          input.inventory.entries = input.inventory.entries.filter(
            (e) => !inputSet.has(e.id)
          );

          // Mark orders as moved
          for (const it of inputItems) {
            if (it.orderId != null) {
              movedOrderIds.add(it.orderId);
            }
          }
        }
      }
    }

    // ---------------------
    // Phase 4: Check Order Completion
    // ---------------------
    this.checkAndCompleteOrders(newState);

    // ---------------------
    // Phase 5: Update Order Relationships
    // ---------------------
    this.updateOrderRelationships(newState);

    // ---------------------
    // Phase 6: Update Order Statuses
    // ---------------------
    for (const oid of movedOrderIds) {
      const orderObj = this.orders.find((o) => o.id === oid);
      if (orderObj && orderObj.status === "pending") {
        orderObj.status = "in_progress";
        orderObj.startedAt = new Date();
        orderObj.startedTick = this.currentTick;
        // Optionally track startedAt or startedTick here if desired
        this.notificationsEnabled &&
          handleNotification(
            "Order Status",
            `Order ${orderObj.id} ist jetzt in Bearbeitung (erstes Material bewegt).`,
            "info"
          );
      }
    }

    return newState;
  }

  /**
   * Handles the reservation of materials for pending orders.
   * @param state The current simulation state.
   */
  private handleOrders(state: SimulationEntityState): void {
    if (this.orders.length === 0) return;

    // Only handle orders that are pending AND have not yet had their materials reserved
    const pending = this.orders.filter(
      (o) => o.status === "pending" && o.materialsReserved !== true
    );

    for (const order of pending) {
      const required = this.getRequiredMaterialsForOrder(order);
      if (required) {
        const success = this.reserveMaterialsForOrder(order, required, state);
        // If success => mark materialsReserved
        if (success) {
          order.materialsReserved = true; // <-- KEY: only do this once
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

  /**
   * Determines the required materials for an order based on its quantity.
   * @param order The order to determine materials for.
   * @returns An array of required materials or null if invalid.
   */
  private getRequiredMaterialsForOrder(
    order: Order & { materialsReserved?: boolean }
  ): { material: string }[] | null {
    if (!order.quantity || order.quantity < 1) return null;
    const baseMaterials = [
      "Seat Structures",
      "Backrest Structures",
      "Seat Foam",
      "Headrest",
      "Airbags",
      "Small Parts",
      "Seat Covers",
      "Backrest Covers",
    ];
    return baseMaterials.map((m) => ({ material: m }));
  }

  /**
   * Reserves materials for an order if available.
   * @param order The order to reserve materials for.
   * @param materials The materials required for the order.
   * @param state The current simulation state.
   * @returns True if reservation is successful; otherwise, false.
   */
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
        // Revert reservation
        allOk = false;
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

  /**
   * Checks and completes orders if all required materials are fulfilled.
   * @param state The current simulation state.
   */
  private checkAndCompleteOrders(state: SimulationEntityState): void {
    // Identify all 'Shipping' inventory IDs
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

  /**
   * Updates the relationships between orders and transport systems based on inventory entries.
   * @param state The current simulation state.
   */
  private updateOrderRelationships(state: SimulationEntityState): void {
    // Create a map of orderId to Order objects
    const orderMap = new Map<number, Order & { materialsReserved?: boolean }>();
    for (const o of this.orders) {
      orderMap.set(o.id, o);
    }

    // Update orders in processSteps, inputs, and outputs based on inventory entries
    for (const loc of state.locations) {
      for (const ps of loc.processSteps) {
        // Gather unique orderIds in the processStep's inventory
        const stepOrderIds = new Set<number>(
          ps.inventory.entries
            .filter((entry) => entry.orderId != null)
            .map((entry) => entry.orderId as number)
        );

        // Update processStep orders
        ps.orders = [...stepOrderIds]
          .map((oid) => orderMap.get(oid))
          .filter((o): o is Order => o != null);

        // Update input transport system orders
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

        // Update output transport system orders
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

  /**
   * Determines if a material represents a completed seat.
   * @param material The material to check.
   * @returns True if the material is a completed seat; otherwise, false.
   */
  private isSeatCompleted(material: string): boolean {
    return material === "Complete Seat";
  }

  /**
   * Checks if there are any active orders (pending or in progress).
   * @returns True if there are active orders; otherwise, false.
   */
  public hasActiveOrders(): boolean {
    return this.orders.some(
      (o) => o.status === "pending" || o.status === "in_progress"
    );
  }

  /**
   * Handles the simulation stop when all orders are completed.
   */
  private handleSimulationStop(): void {
    this.isStopped = true;
    this.notificationsEnabled &&
      handleNotification(
        "Simulation Stopped",
        "Alle Orders sind abgeschlossen. Keine weitere Berechnung.",
        "info"
      );
  }

  // --- Static Methods ---

  /**
   * Rebuilds references between transport systems and process steps based on inventory entries.
   * @param state The simulation state to update references in.
   */
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

  /**
   * Deep clones the simulation state, converting date strings to Date objects.
   * @param state The state to clone.
   * @returns A deep-cloned state.
   */
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
