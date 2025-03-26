import {
  InventoryEntry,
  Prisma,
  Order,
  LogEntry,
  Resource as ResourceModel, // renamed to avoid naming collisions
} from "@prisma/client";
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
  private notificationsEnabled: boolean = false; // we set this true for demonstration
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
    let newState = Simulation.cloneState(oldState);
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

    // [QUEUE CODE] Dequeue from PS & TS
    this.dequeueItems(newState);

    // ---------------- (A) RECIPE STEPS ----------------
    for (const location of newState.locations) {
      for (const ps of location.processSteps) {
        if (!ps.active || !ps.recipe) continue;

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

        // start new
        if (ephemeralProd.length === 0) {
          const itemsConsumedPerRun = ps.recipe.inputs
            .map((o) => o.quantity)
            .reduce((acc, cur) => acc + cur, 0);
          const itemsProducedPerRun = ps.recipe.outputs
            .map((o) => o.quantity)
            .reduce((acc, cur) => acc + cur, 0);

          const effectiveRecipeRate = Math.floor(
            ps.recipeRate * ((ps as any).__productionMultiplier || 0)
          );

          for (
            let r = 0;
            r < effectiveRecipeRate &&
            ps.inventory.entries.length +
              (itemsProducedPerRun - itemsConsumedPerRun) <=
              ps.inventory.limit;
            r++
          ) {
            let inputsFulfilled = true;
            const inputEntries: InventoryEntry[] = [];

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

            if (inputsFulfilled) {
              if (!this.checkResourceFaulty(ps)) {
                continue;
              }
              if (!this.productionSucceeds(ps)) {
                // skip
              } else {
                const transformStart = Math.min(
                  ...inputEntries.map(
                    (xx) =>
                      (xx as InventoryEntryWithDelay).arrivedTick ??
                      this.currentTick
                  )
                );
                const transformationDuration =
                  this.currentTick - transformStart;

                if (!psDurationMap[ps.name]) {
                  psDurationMap[ps.name] = [];
                }
                psDurationMap[ps.name].push(
                  Math.max(0, transformationDuration)
                );

                // remove inputs
                const inputSet = new Set(inputEntries);
                const toRemove = ps.inventory.entries.filter((e) =>
                  inputSet.has(e)
                );
                Simulation.freeSlots(ps.inventory, toRemove);

                ps.inventory.entries = ps.inventory.entries.filter(
                  (e) => !inputSet.has(e)
                );

                const finishTick = this.currentTick + (ps.duration || 1);
                ephemeralProd.push({
                  finishTick,
                  affectedOrderIds: Array.from(
                    new Set(inputEntries.map((e) => e.orderId))
                  ).filter((x): x is number => x != null),
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

    // ---------------- (B) NO-RECIPE STEPS ----------------
    for (const location of newState.locations) {
      for (const ps of location.processSteps) {
        if (!ps.active || ps.recipe) continue;

        const ephemeralProd = (ps as any)
          .__ongoingProduction as ProcessStepProduction[];

        if (ephemeralProd.length > 0) {
          const currentProd = ephemeralProd[0];
          if (this.currentTick >= currentProd.finishTick) {
            this.finalizeNoRecipe(ps, currentProd, psDurationMap);
            ephemeralProd.shift();
          }
        }

        if (ephemeralProd.length === 0) {
          const rawItems = [...ps.inventory.entries];
          if (rawItems.length > 0) {
            const finishTick = this.currentTick + (ps.duration || 1);
            ephemeralProd.push({
              finishTick,
              affectedOrderIds: [],
              itemsProducedPerRun: 0,
              rawItems,
              recipeOutputs: [],
            });
          }
        }
      }
    }

    // ---------------- (C) OUTLET: PS -> TS ----------------
    for (const location of newState.locations) {
      for (const ps of location.processSteps) {
        if (!ps.active) continue;

        const effOutSpeed = Math.floor(
          ps.outputSpeed * ((ps as any).__inventoryMultiplier || 0)
        );
        if (effOutSpeed <= 0) continue;

        const activeOutputs = ps.outputs.filter((o) => o.active);
        const outputSpeeds = activeOutputs.map((o) =>
          Math.min(
            effOutSpeed,
            Math.floor(o.outputSpeed * ((o as any).__inventoryMultiplier || 1))
          )
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
          const effTSOutSpeed = Math.floor(
            ts.outputSpeed * ((ts as any).__inventoryMultiplier || 0)
          );
          if (effTSOutSpeed <= 0) continue;

          this.sensorLog(ps, "output", itemsPerOutput[i]);
          this.sensorLog(ts, "input", itemsPerOutput[i]);

          const outIds = new Set(itemsPerOutput[i].map((x) => x.id));
          const removingEntries = ps.inventory.entries.filter((e) =>
            outIds.has(e.id)
          );
          Simulation.freeSlots(ps.inventory, removingEntries);

          ps.inventory.entries = ps.inventory.entries.filter(
            (e) => !outIds.has(e.id)
          );

          const entriesOut = itemsPerOutput[i].map((item) => ({
            ...item,
            addedAt: new Date(),
            inventoryId: ts.inventory.id,
            arrivedTick: this.currentTick,
            slotNumber: undefined,
          })) as InventoryEntryWithDelay[];

          // If TS is full or inactive, queue them
          if (
            ts.inventory.entries.length + entriesOut.length >
              ts.inventory.limit ||
            !ts.active
          ) {
            (ts as any).__queue.push(...entriesOut);

            // [QUEUE NOTIF] for TS
            if (this.notificationsEnabled && entriesOut.length > 0) {
              handleNotification(
                "Queue",
                `${entriesOut.length} item(s) queued in TransportSystem (${ts.name})`,
                "warning"
              );
            }
          } else {
            ts.inventory.entries.push(...entriesOut);
            Simulation.assignSlots(ts.inventory, entriesOut);
            for (const eo of entriesOut) {
              if (eo.orderId != null) {
                movedOrderIds.add(eo.orderId);
              }
            }
          }
        }
      }
    }

    // ---------------- (D) INTAKE: TS -> PS ----------------
    const sourceAvailability = new Map<number, boolean>();
    for (const loc of newState.locations) {
      for (const ps of loc.processSteps) {
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

    for (const loc of newState.locations) {
      for (const ps of loc.processSteps) {
        if (!ps.active) continue;

        const effInSpeed = Math.floor(
          ps.inputSpeed * ((ps as any).__inventoryMultiplier || 0)
        );
        if (effInSpeed <= 0) continue;

        for (const input of ps.inputs) {
          if (!input.active) continue;

          const capacityNow = ps.inventory.limit - ps.inventory.entries.length;
          if (capacityNow <= 0) continue;

          const speedIn = Math.min(
            effInSpeed,
            Math.floor(
              input.outputSpeed * ((input as any).__inventoryMultiplier || 0)
            )
          );
          if (speedIn <= 0) continue;

          const potentialItems = input.inventory.entries.filter((entry) => {
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

          if (potentialItems.length === 0) continue;

          if (
            input.minQuantity != null &&
            input.minQuantity > 0 &&
            potentialItems.length < input.minQuantity
          ) {
            const sourceStepId = input.startStepId ?? -1;
            const sourceEmpty = !sourceAvailability.get(sourceStepId);
            if (!sourceEmpty) {
              continue;
            }
          }

          // We'll do a simple FIFO
          const sortedPotentials = potentialItems.sort(
            (a, b) => a.addedAt.getTime() - b.addedAt.getTime()
          );

          const acceptedItems: InventoryEntryWithDelay[] = [];
          for (const candidate of sortedPotentials) {
            if (acceptedItems.length >= speedIn) break;
            if (
              ps.inventory.entries.length + acceptedItems.length >=
              ps.inventory.limit
            ) {
              // [QUEUE CODE + NOTIF] If PS is full => queue items
              (ps as any).__queue.push(candidate);

              if (this.notificationsEnabled) {
                handleNotification(
                  "Queue",
                  `1 item queued in ProcessStep (${ps.name}) - capacity full`,
                  "warning"
                );
              }
              continue;
            }
            const testItem: InventoryEntryWithDelay = {
              ...candidate,
              inventoryId: ps.inventory.id,
            };
            const testArray = [...acceptedItems, testItem];
            if (!ps.recipe || this.canIntakeItems(ps, testArray)) {
              acceptedItems.push(candidate);
            }
          }

          if (acceptedItems.length === 0) {
            continue;
          }

          this.sensorLog(input, "output", acceptedItems);
          this.sensorLog(ps, "input", acceptedItems);

          for (const movedItem of acceptedItems) {
            const typed = movedItem as InventoryEntryWithDelay;
            if (typed.arrivedTick != null) {
              typed.leftTick = this.currentTick;
              const diff = typed.leftTick - typed.arrivedTick;
              if (diff >= 0) {
                const tsType = input.type || "Unknown";
                tsDurationMap[tsType] = tsDurationMap[tsType] || [];
                tsDurationMap[tsType].push(diff);
              }
            }
          }

          const acceptedIds = new Set(acceptedItems.map((x) => x.id));
          const removingEntries = input.inventory.entries.filter((e) =>
            acceptedIds.has(e.id)
          );
          Simulation.freeSlots(input.inventory, removingEntries);

          input.inventory.entries = input.inventory.entries.filter(
            (e) => !acceptedIds.has(e.id)
          );

          for (const item of acceptedItems) {
            const newItem: InventoryEntryWithDelay = {
              ...item,
              addedAt: new Date(),
              inventoryId: ps.inventory.id,
              slotNumber: undefined,
            };
            ps.inventory.entries.push(newItem);
            Simulation.assignSlots(ps.inventory, [newItem]);

            if (newItem.orderId != null) {
              movedOrderIds.add(newItem.orderId);
            }
          }
        }
      }
    }

    function canExpectMoreItemsFromSource(
      state: SimulationEntityState,
      sourceStepId: number | null | undefined,
      activeOrderIds: Set<number>
    ): boolean {
      if (!sourceStepId) return false;
      const sourceStep = state.locations
        .flatMap((xx) => xx.processSteps)
        .find((procStep) => procStep.id === sourceStepId);
      if (!sourceStep) return false;
      return sourceStep.inventory.entries.some(
        (it) => it.orderId && activeOrderIds.has(it.orderId)
      );
    }

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
            `Order ${orderObj.id} ist jetzt in Bearbeitung (erstes Material bewegt).`,
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
  private dequeueItems(newState: SimulationEntityState) {
    for (const loc of newState.locations) {
      for (const ps of loc.processSteps) {
        // If ps has a queue
        if (!(ps as any).__queue) continue;
        if (!ps.active) continue;

        const capNow = ps.inventory.limit - ps.inventory.entries.length;
        if (capNow <= 0) continue;

        const psQueue = (ps as any).__queue as InventoryEntryWithDelay[];
        const toMove = psQueue.splice(0, capNow);
        if (toMove.length > 0) {
          // Unqueued from a process step
          if (this.notificationsEnabled) {
            handleNotification(
              "Queue",
              `${toMove.length} item(s) unqueued from ProcessStep (${ps.name})`,
              "info"
            );
          }

          ps.inventory.entries.push(...toMove);
          Simulation.assignSlots(ps.inventory, toMove);
        }
      }

      // For each TS in each processStep
      for (const ps of loc.processSteps) {
        for (const ts of ps.inputs.concat(ps.outputs)) {
          if (!(ts as any).__queue) continue;
          if (!ts.active) continue;

          const capNow = ts.inventory.limit - ts.inventory.entries.length;
          if (capNow <= 0) continue;

          const tsQueue = (ts as any).__queue as InventoryEntryWithDelay[];
          const toMove = tsQueue.splice(0, capNow);
          if (toMove.length > 0) {
            // Unqueued from a transport system
            if (this.notificationsEnabled) {
              handleNotification(
                "Queue",
                `${toMove.length} item(s) unqueued from ${
                  ts.type || "TransportSystem"
                } (${ts.name})`,
                "info"
              );
            }
            ts.inventory.entries.push(...toMove);
            Simulation.assignSlots(ts.inventory, toMove);
          }
        }
      }
    }
  }

  // --------------- Resource Logic ---------------
  private applyResourceLogic(newState: SimulationEntityState) {
    for (const loc of newState.locations) {
      for (const ps of loc.processSteps) {
        const prodResources = ps.resources.filter((r) => r.productionResource);
        const invResources = ps.resources.filter((r) => r.inventoryResource);

        const activeProd = prodResources.filter((r) => r.active && !r.faulty);
        const activeInv = invResources.filter((r) => r.active && !r.faulty);

        let prodMultiplier = 1;
        if (prodResources.length > 0) {
          const mandatoryProd = prodResources.filter((r) => r.mandatory);
          if (
            mandatoryProd.length === 1 &&
            (mandatoryProd[0].faulty || !mandatoryProd[0].active)
          ) {
            prodMultiplier = 0;
          } else {
            prodMultiplier = prodResources.length
              ? activeProd.length / prodResources.length
              : 1;
          }
        }

        let invMultiplier = 1;
        if (invResources.length > 0) {
          const mandatoryInv = invResources.filter((r) => r.mandatory);
          if (
            mandatoryInv.length === 1 &&
            (mandatoryInv[0].faulty || !mandatoryInv[0].active)
          ) {
            invMultiplier = 0;
          } else {
            invMultiplier = invResources.length
              ? activeInv.length / invResources.length
              : 1;
          }
        }

        (ps as any).__productionMultiplier = prodMultiplier;
        (ps as any).__inventoryMultiplier = invMultiplier;
      }

      for (const ps of loc.processSteps) {
        for (const ts of ps.inputs.concat(ps.outputs)) {
          const tsResources = ts.resources || [];
          const activeTSRes = tsResources.filter((r) => r.active && !r.faulty);

          let tsMultiplier = 1;
          if (tsResources.length > 0) {
            const mandatoryTS = tsResources.filter((r) => r.mandatory);
            if (
              mandatoryTS.length === 1 &&
              (mandatoryTS[0].faulty || !mandatoryTS[0].active)
            ) {
              tsMultiplier = 0;
            } else {
              tsMultiplier = tsResources.length
                ? activeTSRes.length / tsResources.length
                : 1;
            }
          }
          (ts as any).__inventoryMultiplier = tsMultiplier;
        }
      }
    }
  }

  // --------------- Helper Logic ---------------
  private checkResourceFaulty(
    res: ProcessStepFull | TransportSystemFull
  ): boolean {
    // Placeholder
    return true;
  }

  private productionSucceeds(ps: ProcessStepFull): boolean {
    if (!ps.errorRate) return true;
    return Math.random() > ps.errorRate;
  }

  private finalizeProductionRun(
    ps: ProcessStepFull,
    newState: SimulationEntityState,
    production: ProcessStepProduction,
    movedOrderIds: Set<number>
  ) {
    for (const oid of production.affectedOrderIds) {
      for (const out of production.recipeOutputs) {
        for (let i = 0; i < out.quantity; i++) {
          const newEntry = {
            id: nextFreeInventoryEntryId(newState),
            addedAt: new Date(),
            inventoryId: ps.inventory.id,
            material: out.material,
            orderId: oid,
            slotNumber: undefined,
          } as InventoryEntryWithDelay;

          ps.inventory.entries.push(newEntry);
          Simulation.assignSlots(ps.inventory, [newEntry]);

          this.sensorLog(ps, "product", [newEntry]);
        }
      }
      movedOrderIds.add(oid);
    }

    console.log(
      `ProcessStep "${ps.name}" completed a production run (duration=${ps.duration}). Produced: ${production.itemsProducedPerRun} item(s) for Orders: ${production.affectedOrderIds}`
    );
  }

  private finalizeNoRecipe(
    ps: ProcessStepFull,
    production: ProcessStepProduction,
    psDurationMap: Record<string, number[]>
  ) {
    const totalWait = ps.duration || 1;
    const itemCount = production.rawItems?.length || 0;
    if (!psDurationMap[ps.name]) {
      psDurationMap[ps.name] = [];
    }
    for (let i = 0; i < itemCount; i++) {
      psDurationMap[ps.name].push(totalWait);
    }

    console.log(
      `ProcessStep "${ps.name}" (no-recipe) waited duration=${ps.duration}. Items: ${itemCount}`
    );
  }

  private sensorLog(
    psOrTS: ProcessStepFull | TransportSystemFull,
    logType: "input" | "output" | "product",
    items: InventoryEntryWithDelay[]
  ): boolean {
    if (!("sensors" in psOrTS) || !Array.isArray(psOrTS.sensors)) {
      return true;
    }
    const isProcessStep = (entity: any): entity is ProcessStepFull =>
      "recipe" in entity;

    for (const sensor of psOrTS.sensors) {
      if (!sensor.active) continue;

      for (const i of items) {
        const newLog: LogEntry = {
          id: sensor.logEntries.length + 1,
          sensorId: sensor.id,
          createdAt: new Date(),
          materialId: i.id,
          materialName: i.material,
          inputType: logType,
          processStepId: isProcessStep(psOrTS) ? psOrTS.id : null,
          transportSystemId: !isProcessStep(psOrTS) ? psOrTS.id : null,
        };
        sensor.logEntries.push(newLog);
        if (logType === "product") sensor.value++;
      }

      console.log(
        `[SENSOR] ${sensor.name} logged ${items.length} items as "${logType}". sensor.value updated to: ${sensor.value}`
      );
    }
    return true;
  }

  private handleOrders(state: SimulationEntityState): void {
    if (this.orders.length === 0) return;
    const pending = this.orders.filter(
      (o) => o.status === "pending" && !o.materialsReserved
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
        if (this.notificationsEnabled) {
          handleNotification(
            "Order Completed",
            `Order ${order.id} wurde abgeschlossen.`,
            "success"
          );
        }
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
    if (!inv.usedSlots) {
      inv.usedSlots = [];
      for (const e of inv.entries) {
        if (e.slotNumber != null && !inv.usedSlots.includes(e.slotNumber)) {
          inv.usedSlots.push(e.slotNumber);
        }
      }
    }
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
    if (!inventory.usedSlots) {
      inventory.usedSlots = [];
    }
    for (const item of entries) {
      let slotFound: number | null = null;
      for (let i = 0; i < inventory.limit; i++) {
        if (!inventory.usedSlots.includes(i)) {
          slotFound = i;
          break;
        }
      }
      if (slotFound == null) {
        console.warn(
          `Kein freier Stellplatz (Slot) mehr in Inventory ${inventory.id}.`
        );
      } else {
        item.slotNumber = slotFound;
        inventory.usedSlots.push(slotFound);
      }
    }
  }

  private static freeSlots(inventory: any, entries: InventoryEntryWithDelay[]) {
    if (!inventory.usedSlots) {
      inventory.usedSlots = [];
    }
    for (const item of entries) {
      if (item.slotNumber != null) {
        inventory.usedSlots = inventory.usedSlots.filter(
          (s: number) => s !== item.slotNumber
        );
        item.slotNumber = undefined;
      }
    }
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
