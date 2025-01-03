// simulationNew.ts
import { InventoryEntry, Prisma, Order } from "@prisma/client";
import { Event } from "./events";
import { nextFreeInventoryEntryId } from "./inventories";
import { distributeRoundRobin } from "./round-robin";
import { notifications } from "@mantine/notifications";
import { handleNotification } from "@/app/notification-settings/page";

/**
 * Konvertiert Datumsstrings ("YYYY-MM-DDTHH:mm:ss.sssZ") in echte Date-Objekte.
 */
export function convertDates(key: string, value: any) {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(value)) return value;
  return new Date(value);
}

/**
 * Dein Prisma Location-Typ mit allen Relationen.
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
 * Der SimulationState enthält nur Locations.
 */
export interface SimulationEntityState {
  locations: LocationFull[];
}

/**
 * Ergebnislauf der Simulation: Frames + Events
 */
export interface SimulationRun {
  frames: SimulationEntityState[];
  events: Event[];
}

/**
 * "Live"-Simulation mit Ticks on-demand.
 * Sie führt keine weitere Logik aus, wenn die Orders "stopped" sind,
 * d. h. alle Orders fertig sind. Der Timer im Frontend kann weiterlaufen.
 */
export class Simulation {
  private readonly events: Event[] = [];
  private readonly orders: Order[] = []; // verwaltete Orders

  private frames: SimulationEntityState[] = [];
  private currentTick = 0;
  private currentState: SimulationEntityState;

  /**
   * Markiert, ob die Simulation bereits "stopped" wurde.
   * Dann wird kein weiterer Rechenaufwand/keine Notification ausgeführt.
   */
  private isStopped = false;

  private notificationsEnabled = false;

  constructor(initialState: SimulationEntityState, initialOrders: Order[]) {
    this.currentState = Simulation.cloneState(initialState);
    this.orders = initialOrders.map((o) => ({ ...o }));

    // frames[0] = Initial
    this.frames.push(Simulation.cloneState(this.currentState));

    // console.log("Initial State:", this.currentState);
    // console.log("Initial Orders:", this.orders);
  }

  public getSimulationRun(): SimulationRun {
    return {
      frames: this.frames.map((f) => Simulation.cloneState(f)),
      events: this.events,
    };
  }

  /**
   * Eine zentrale Getter-Methode für ALLE Orders
   */
  public getAllOrders(): Order[] {
    return this.orders;
  }

  public getCurrentTick(): number {
    return this.currentTick;
  }

  /**
   * Führt genau einen Tick durch, sofern die Simulation nicht "stopped" ist.
   * Wird vom Frontend in einem Interval aufgerufen –
   * aber wir skippen intern, wenn isStopped=true.
   */
  public tickForward(): void {
    if (this.isStopped) {
      // Skip: Kein Rechenaufwand mehr
      return;
    }

    const newState = this.computeNextTick(this.currentState);
    this.currentTick += 1;
    this.currentState = Simulation.cloneState(newState);

    this.frames.push(Simulation.cloneState(this.currentState));

    // Check: Orders alle fertig?
    if (!this.hasActiveOrders() && !this.isStopped) {
      this.handleSimulationStop();
    }
    // console.log("Orders:", this.orders);
    // console.log("Simulation", this.frames);
  }

  /**
   * Optionaler Helfer für mehrere Ticks in Serie
   */
  public runNext(n: number) {
    for (let i = 0; i < n; i++) {
      this.tickForward();
    }
  }

  /**
   * Hauptlogik: Berechnet 1 Tick, falls Orders aktiv.
   * Sonst: skip.
   */
  private computeNextTick(
    oldState: SimulationEntityState
  ): SimulationEntityState {
    let newState = Simulation.cloneState(oldState);
    Simulation.objectsToReferences(newState);

    // Phase 0: Orders
    this.handleOrders(newState);

    // Prüfen, ob noch Orders aktiv sind:
    if (!this.hasActiveOrders()) {
      // => Nichts weiter tun, wir skippen
      return newState;
    }

    // Phase 1: Production
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
              if (recipeInput.material === entry.material) {
                // nur items mit aktiver order
                if (
                  entry.orderId &&
                  this.orders.find(
                    (o) =>
                      o.id === entry.orderId &&
                      (o.status === "in_progress" || o.status === "pending")
                  )
                ) {
                  possible.push(entry);
                }
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
            // betroffene Orders
            const affectedOrders = Array.from(
              new Set(inputEntries.map((e) => e.orderId))
            );

            ps.inventory.entries = ps.inventory.entries.filter(
              (e) => !inputEntries.includes(e)
            );

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
            .filter((entry) =>
              this.orders.some(
                (o) =>
                  o.id === entry.orderId &&
                  (o.status === "in_progress" || o.status === "pending")
              )
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

          // remove from ps
          ps.inventory.entries = ps.inventory.entries.filter(
            (e) => !entriesOut.some((eo) => eo.id === e.id)
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
            .filter((entry) =>
              this.orders.some(
                (o) =>
                  o.id === entry.orderId &&
                  (o.status === "in_progress" || o.status === "pending")
              )
            )
            .sort((a, b) => a.addedAt.getTime() - b.addedAt.getTime())
            .slice(0, speedIn)
            .map((e) => ({
              ...e,
              addedAt: new Date(),
              inventoryId: ps.inventory.id,
            }));

          ps.inventory.entries.push(...inputItems);
          input.inventory.entries = input.inventory.entries.filter(
            (e) => !inputItems.some((it) => it.id === e.id)
          );
        }
      }
    }

    // Phase 4: Orders fertig?
    this.checkAndCompleteOrders(newState);

    return newState;
  }

  /**
   * Reserviert Orders mit Materials
   */
  private handleOrders(state: SimulationEntityState) {
    if (this.orders.length === 0) return;

    const pending = this.orders.filter((o) => o.status === "pending");
    for (const order of pending) {
      const required = this.getRequiredMaterialsForOrder(order);
      if (required) {
        const success = this.reserveMaterialsForOrder(order, required, state);
        if (success) {
          order.status = "in_progress";
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
   * Ganz simpel: wir brauchen baseMaterials * quantity
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
        // revert
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
   * Schaut, ob Orders "complete" sind
   */
  private checkAndCompleteOrders(state: SimulationEntityState) {
    // shipping
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

        this.notificationsEnabled &&
          handleNotification(
            "Order Completed",
            `Order ${order.id} wurde abgeschlossen.`,
            "success"
          );
        // console.log(`Order ${order.id} abgeschlossen.`);
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
    // Nur einmal Meldung
    this.notificationsEnabled &&
      handleNotification(
        "Simulation Stopped",
        "Alle Orders sind abgeschlossen. Keine weitere Berechnung.",
        "info"
      );
    // console.log("Simulation gestoppt: Keine aktiven Orders mehr vorhanden.");
    // => ABER wir hören NICHT auf zu ticken, wir skippen intern
    // (im code. Siehe 'if (!this.hasActiveOrders()) {return newState}' in computeNextTick)
  }

  /**
   * Hilfsfunktion: TransportSystem-Objekte referenzieren
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

  /**
   * Klont den State (auch Datumsfelder).
   */
  private static cloneState(
    state: SimulationEntityState
  ): SimulationEntityState {
    return JSON.parse(JSON.stringify(state), convertDates);
  }
}
