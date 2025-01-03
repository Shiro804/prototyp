// simulationNew.ts
import { InventoryEntry, Prisma, Order } from "@prisma/client";
import { Event } from "./events";
import { nextFreeInventoryEntryId } from "./inventories";
import { distributeRoundRobin } from "./round-robin";
import { notifications } from "@mantine/notifications";
import { handleNotification } from "@/app/notification-settings/page";

/**
 * Convert date strings to actual Date objects
 */
export function convertDates(key: string, value: any) {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(value)) return value;
  return new Date(value);
}

/**
 * Prisma "LocationFull" type with all includes
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

export interface SimulationEntityState {
  locations: LocationFull[];
}

export interface SimulationRun {
  frames: SimulationEntityState[];
  events: Event[];
}

/**
 * "Live"-Simulation class that updates ticks on-demand.
 */
export class Simulation {
  private readonly events: Event[] = [];
  private readonly orders: Order[] = []; // The in-memory Orders

  private frames: SimulationEntityState[] = [];
  private currentTick = 0;
  private currentState: SimulationEntityState;

  // Mark if the simulation is stopped
  private isStopped = false;

  private notificationsEnabled = false;

  constructor(initialState: SimulationEntityState, initialOrders: Order[]) {
    this.currentState = Simulation.cloneState(initialState);
    // Clone initialOrders so we don't mutate original references
    this.orders = initialOrders.map((o) => ({ ...o }));

    // frames[0] = initial
    this.frames.push(Simulation.cloneState(this.currentState));
  }

  /**
   * Return the entire simulation so far
   */
  public getSimulationRun(): SimulationRun {
    return {
      frames: this.frames.map((f) => Simulation.cloneState(f)),
      events: this.events,
    };
  }

  /**
   * Return all Orders in-memory
   */
  public getAllOrders(): Order[] {
    return this.orders;
  }

  /**
   * Return the current tick index
   */
  public getCurrentTick(): number {
    return this.currentTick;
  }

  /**
   * Advance one tick, if not stopped
   */
  public tickForward(): void {
    if (this.isStopped) {
      return;
    }

    const newState = this.computeNextTick(this.currentState);
    this.currentTick += 1;
    this.currentState = Simulation.cloneState(newState);

    this.frames.push(Simulation.cloneState(this.currentState));

    // Check if all Orders are done
    if (!this.hasActiveOrders() && !this.isStopped) {
      this.handleSimulationStop();
    }

    console.log("Simulation tick:", this.frames.length);
  }

  /**
   * Optionally run multiple ticks
   */
  public runNext(n: number) {
    for (let i = 0; i < n; i++) {
      this.tickForward();
    }
  }

  /**
   * The main logic for 1 tick
   */
  private computeNextTick(
    oldState: SimulationEntityState
  ): SimulationEntityState {
    let newState = Simulation.cloneState(oldState);
    Simulation.objectsToReferences(newState);

    // Phase 0: Orders (reservation only)
    this.handleOrders(newState);

    if (!this.hasActiveOrders()) {
      return newState;
    }

    // Build a set of all active Orders
    const activeOrderIds = new Set(
      this.orders
        .filter((o) => o.status === "in_progress" || o.status === "pending")
        .map((o) => o.id)
    );

    // Phase 1: Production
    for (const location of newState.locations) {
      for (const ps of location.processSteps) {
        if (!ps.recipe) continue;

        const itemsProducedPerRun = ps.recipe.outputs
          .map((o) => o.quantity)
          .reduce((acc, cur) => acc + cur, 0);

        // We attempt up to ps.recipeRate times
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
            // remove consumed
            const inputEntriesSet = new Set(inputEntries);
            ps.inventory.entries = ps.inventory.entries.filter(
              (e) => !inputEntriesSet.has(e)
            );

            // add outputs
            for (const out of ps.recipe.outputs) {
              for (let i = 0; i < out.quantity; i++) {
                for (const consumed of inputEntries) {
                  ps.inventory.entries.push({
                    id: nextFreeInventoryEntryId(newState),
                    addedAt: new Date(),
                    inventoryId: ps.inventory.id,
                    material: out.material,
                    orderId: consumed.orderId,
                  });
                }
              }
            }

            // increment transformations
            if (ps.totalRecipeTransformations == null) {
              ps.totalRecipeTransformations = 0;
            }
            ps.totalRecipeTransformations++;

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

    // Phase 2: Outlet
    for (const loc of newState.locations) {
      for (const ps of loc.processSteps) {
        const outputSpeeds = ps.outputs.map((o) =>
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

          // remove them from ps
          const outIds = new Set(entriesOut.map((x) => x.id));
          ps.inventory.entries = ps.inventory.entries.filter(
            (e) => !outIds.has(e.id)
          );
        }
      }
    }

    // Phase 3: Intake
    for (const loc of newState.locations) {
      for (const ps of loc.processSteps) {
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
        }
      }
    }

    // Phase 4: Check if Orders completed
    this.checkAndCompleteOrders(newState);

    // Phase 5: update relationships
    this.updateOrderRelationships(newState);

    return newState;
  }

  /**
   * Reservation logic only – if successful => set to "in_progress", track ticks
   */
  private handleOrders(state: SimulationEntityState) {
    if (this.orders.length === 0) return;

    const pending = this.orders.filter((o) => o.status === "pending");
    for (const order of pending) {
      const required = this.getRequiredMaterialsForOrder(order);
      if (required) {
        const success = this.reserveMaterialsForOrder(order, required, state);
        if (success) {
          // Immediately mark in_progress + set startedAt & startedTick
          order.status = "in_progress";
          order.startedAt = new Date();
          order.startedTick = this.frames.length; // e.g. or this.currentTick

          this.notificationsEnabled &&
            handleNotification(
              "Order Status",
              `Order ${order.id} ist jetzt in Bearbeitung.`,
              "info"
            );
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
   * Base materials * quantity
   */
  private getRequiredMaterialsForOrder(
    order: Order
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

  private reserveMaterialsForOrder(
    order: Order,
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
        // revert partial
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
   * Checks if Orders are complete => set status = "completed"
   */
  private checkAndCompleteOrders(state: SimulationEntityState) {
    // identify the "Shipping" inventory
    const shippingIds = state.locations
      .flatMap((l) => l.processSteps)
      .filter((p) => p.name === "Shipping")
      .map((p) => p.inventory.id);

    for (const order of this.orders) {
      if (order.status === "completed") continue;

      const seatsInShipping = state.locations
        .flatMap((l) => l.processSteps)
        .flatMap((p) => p.inventory.entries)
        .filter(
          (e) =>
            e.orderId === order.id &&
            this.isSeatCompleted(e.material) &&
            shippingIds.includes(e.inventoryId)
        ).length;

      if (seatsInShipping >= order.quantity) {
        order.status = "completed";
        order.completedAt = new Date();
        order.completedTick = this.frames.length; // or this.currentTick

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
    const orderMap = new Map<number, Order>();
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

        // For each input
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

        // For each output
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
  }

  private isSeatCompleted(material: string) {
    return material === "Complete Seat";
  }

  public hasActiveOrders(): boolean {
    return this.orders.some(
      (o) => o.status === "pending" || o.status === "in_progress"
    );
  }

  private handleSimulationStop() {
    this.isStopped = true;

    this.notificationsEnabled &&
      handleNotification(
        "Simulation Stopped",
        "Alle Orders sind abgeschlossen. Keine weitere Berechnung.",
        "info"
      );
  }

  /**
   * Link transport system references
   */
  private static objectsToReferences(state: SimulationEntityState) {
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
}
