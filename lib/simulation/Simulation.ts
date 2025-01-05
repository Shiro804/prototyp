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

export type TransportSystemFull = Prisma.TransportSystemGetPayload<{
  include: {
    inventory: { include: { entries: true } };
    filter: { include: { entries: true } };
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
}

export interface SimulationRun {
  frames: SimulationFrame[];
  events: Event[];
}

/**
 * Wir erweitern InventoryEntry nur zur Laufzeit, um ein `arrivedTick` einzutragen,
 * wenn ein Item ins TransportSystem gelangt. Das ist kein DB-Feld, sondern "ephemer".
 */
export type InventoryEntryWithDelay = InventoryEntry & {
  arrivedTick?: number; // -- (NEU) Marker, wann Item im TS angekommen ist
};

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

  // -- (NEU) Transport-Verzögerung in Ticks
  private readonly transportDelay = 1;

  constructor(initialState: SimulationEntityState, initialOrders: Order[]) {
    this.initialState = Simulation.cloneState(initialState);
    this.currentState = Simulation.cloneState(initialState);
    this.orders = initialOrders.map((o) => ({
      ...o,
      materialsReserved: false,
    }));

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
      this.currentTick = targetFrame.tick;
      this.currentState = Simulation.cloneState(targetFrame.state);
      this.orders = Simulation.cloneOrders(targetFrame.orders);
      this.frames = this.frames.filter((f) => f.tick <= targetTick);
      this.discardFutureFrames();
    } else {
      const lastTick = this.currentTick;
      if (targetTick > lastTick) {
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
      this.currentTick = nextFrame.tick;
      this.currentState = Simulation.cloneState(nextFrame.state);
      this.frames.push(nextFrame);
      this.futureFrames = this.futureFrames.filter((f) => f.tick > nextTick);
    } else {
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

  // -----------------------------------------------
  //           computeNextTick  (Kernlogik)
  // -----------------------------------------------
  private computeNextTick(
    oldState: SimulationEntityState
  ): SimulationEntityState {
    let newState = Simulation.cloneState(oldState);
    Simulation.objectsToReferences(newState);

    this.handleOrders(newState);

    if (!this.hasActiveOrders()) {
      return newState;
    }

    const movedOrderIds = new Set<number>();
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
            const affectedOrders = Array.from(
              new Set(inputEntries.map((e) => e.orderId))
            );

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

            if (ps.totalRecipeTransformations == null) {
              ps.totalRecipeTransformations = 0;
            }
            ps.totalRecipeTransformations++;

            for (const oid of affectedOrders) {
              if (oid != null) {
                movedOrderIds.add(oid);
              }
            }

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
          // -- (NEU) Alle Items, die in TS verschoben werden, bekommen arrivedTick = currentTick
          let entriesOut = itemsPerOutput[i].map((item) => ({
            ...item,
            addedAt: new Date(),
            inventoryId: ts.inventory.id,
            arrivedTick: this.currentTick, // <=== (NEU)
          })) as InventoryEntryWithDelay[];

          ts.inventory.entries.push(...entriesOut);

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

    // ---------------------
    // Phase 3: Intake
    // ---------------------
    for (const location of newState.locations) {
      for (const ps of location.processSteps) {
        for (const input of ps.inputs) {
          let speedIn = Math.min(ps.inputSpeed, input.outputSpeed);

          // -- (NEU) Nur Items übernehmen, deren arrivedTick so weit zurückliegt,
          //          dass sie mind. 'transportDelay' Ticks im TS waren.
          let inputItems = input.inventory.entries
            .filter((entry) => {
              // Muss eine aktive Order sein
              if (!entry.orderId || !activeOrderIds.has(entry.orderId))
                return false;

              // Falls kein arrivedTick existiert, aus Sicherheitsgründen lieber NICHT ziehen
              if ((entry as InventoryEntryWithDelay).arrivedTick == null)
                return false;

              // Check TransportDelay
              const arrTick = (entry as InventoryEntryWithDelay).arrivedTick!;
              return this.currentTick - arrTick >= this.transportDelay;
            })
            .sort((a, b) => a.addedAt.getTime() - b.addedAt.getTime())
            .slice(0, speedIn)
            .map((e) => ({
              ...e,
              addedAt: new Date(),
              inventoryId: ps.inventory.id,
              // arrivedTick kann man entfernen oder auf undefined setzen, wenn man möchte
            }));

          ps.inventory.entries.push(...inputItems);

          const inputSet = new Set(inputItems.map((x) => x.id));
          input.inventory.entries = input.inventory.entries.filter(
            (e) => !inputSet.has(e.id)
          );

          for (const it of inputItems) {
            if (it.orderId != null) {
              movedOrderIds.add(it.orderId);
            }
          }
        }
      }
    }

    // Phase 4: Check Order Completion
    this.checkAndCompleteOrders(newState);

    // Phase 5: Update Order Relationships
    this.updateOrderRelationships(newState);

    // Phase 6: Update Order Statuses
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

    return newState;
  }

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
