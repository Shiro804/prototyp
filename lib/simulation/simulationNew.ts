// simulationNew.ts
import { InventoryEntry, Prisma, Order } from "@prisma/client";
import { Event } from "./events";
import { nextFreeInventoryEntryId } from "./inventories";
import { distributeRoundRobin } from "./round-robin";
import { notifications } from "@mantine/notifications";
import { handleNotification } from "@/app/general-settings/page";

export function convertDates(key: string, value: any) {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(value)) return value;
  return new Date(value);
}

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
            inventory: {
              include: {
                entries: true;
              };
            };
            filter: {
              include: {
                entries: true;
              };
            };
            orders: true;
          };
        };
        outputs: {
          include: {
            inventory: {
              include: {
                entries: true;
              };
            };
            filter: {
              include: {
                entries: true;
              };
            };
            orders: true;
          };
        };
        sensors: true;
        inventory: {
          include: {
            entries: true;
          };
        };
        recipe: {
          include: {
            inputs: true;
            outputs: true;
          };
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
  /**
   * Now just an array of frames from tick 0 up to the last computed tick
   */
  frames: SimulationEntityState[];
  /**
   * Any events your logic wants to track
   */
  events: Event[];
}

/**
 * "Live" Simulation class refactored to compute ticks on-demand,
 * similar to SimulationMock.
 */
export class Simulation {
  private readonly events: Event[] = [];
  private readonly orders: Order[] = []; // Intern verwaltete Orders

  /**
   * We store every state as a "frame".
   * frames[0] = the initial state at tick=0
   * frames[1] = the state after the first tick
   * ...
   */
  private frames: SimulationEntityState[] = [];

  /**
   * We'll keep track of a 'currentTick' integer and a 'currentState'
   * to know the latest actual state.
   */
  private currentTick = 0;
  private currentState: SimulationEntityState;

  constructor(initialState: SimulationEntityState, initialOrders: Order[]) {
    // 1) Clone the initial state so we don't mutate the original
    this.currentState = Simulation.cloneState(initialState);

    // 2) Initial Orders verwalten
    this.orders = initialOrders.map((order) => ({ ...order }));

    // 3) frames[0] = initial state at tick 0
    this.frames.push(Simulation.cloneState(this.currentState));

    // Debugging
    console.log("Initial State:", this.currentState);
    console.log("Initial Orders:", this.orders);
  }

  /** Return the entire simulation so far. */
  public getSimulationRun(): SimulationRun {
    return {
      // We can return a clone if you want full immutability
      frames: this.frames.map((f) => Simulation.cloneState(f)),
      events: this.events,
    };
  }

  /** Return the current tick index. */
  public getCurrentTick(): number {
    return this.currentTick;
  }

  /**
   * Compute the next tick from the currentState, and store the result as a new frame.
   */
  public tickForward(): void {
    const newState = this.computeNextTick(this.currentState);
    this.currentTick += 1;
    this.currentState = Simulation.cloneState(newState);

    // push the new state into frames
    this.frames.push(Simulation.cloneState(this.currentState));

    // Überprüfen, ob noch aktive Orders vorhanden sind
    if (!this.hasActiveOrders()) {
      // Simulation pausieren
      this.handleSimulationStop();
    }

    // Debugging
    console.log("Orders: ", this.orders);
  }

  /**
   * Optionally, a helper to compute multiple ticks in a row:
   */
  public runNext(n: number) {
    for (let i = 0; i < n; i++) {
      this.tickForward();
    }
  }

  /**
   * Die eigentliche Logik aus Ihrer alten "tick()" Methode,
   * refaktoriert in `computeNextTick()`.
   */
  private computeNextTick(
    oldState: SimulationEntityState
  ): SimulationEntityState {
    let newState = Simulation.cloneState(oldState);
    Simulation.objectsToReferences(newState);

    // Phase 0: Order Handling
    this.handleOrders(newState);

    // Überprüfen, ob noch aktive Orders vorhanden sind
    const activeOrders = this.hasActiveOrders();

    if (activeOrders) {
      // Phase 1: Production
      for (const location of newState.locations) {
        for (const processStep of location.processSteps) {
          if (processStep.recipe) {
            const itemsProducedPerRun = processStep.recipe.outputs
              .map((o) => o.quantity)
              .reduce((acc, cur) => acc + cur, 0);

            for (
              let r = 0;
              r < processStep.recipeRate &&
              processStep.inventory.entries.length + itemsProducedPerRun <=
                processStep.inventory.limit;
              r++
            ) {
              let inputsFulfilled = true;
              let inputEntries: InventoryEntry[] = [];

              for (let recipeInput of processStep.recipe.inputs) {
                let possibleInputEntries: InventoryEntry[] = [];

                for (const entry of processStep.inventory.entries) {
                  if (recipeInput.material === entry.material) {
                    // Berücksichtige nur Einträge, die einer aktiven Order zugeordnet sind
                    if (
                      entry.orderId &&
                      this.orders.find(
                        (order) =>
                          order.id === entry.orderId &&
                          (order.status === "in_progress" ||
                            order.status === "pending")
                      )
                    ) {
                      possibleInputEntries.push(entry);
                    }
                  }
                  if (possibleInputEntries.length >= recipeInput.quantity) {
                    break;
                  }
                }

                if (possibleInputEntries.length >= recipeInput.quantity) {
                  inputEntries.push(...possibleInputEntries);
                } else {
                  inputsFulfilled = false;
                  break; // Breche ab, wenn nicht genügend Materialien für eine Zutat vorhanden sind
                }
              }

              if (inputsFulfilled) {
                // Bestimmen der betroffenen Orders basierend auf den Input-Einträgen
                const affectedOrders = Array.from(
                  new Set(inputEntries.map((entry) => entry.orderId))
                );

                // Entfernen der konsumierten Inputs
                processStep.inventory.entries =
                  processStep.inventory.entries.filter(
                    (e) => !inputEntries.includes(e)
                  );

                // Hinzufügen der Outputs mit der entsprechenden orderId
                for (const output of processStep.recipe.outputs) {
                  for (let i = 0; i < output.quantity; i++) {
                    for (const orderId of affectedOrders) {
                      processStep.inventory.entries.push({
                        id: nextFreeInventoryEntryId(newState),
                        addedAt: new Date(),
                        inventoryId: processStep.inventory.id,
                        material: output.material,
                        orderId: orderId, // Zuweisen der orderId des Inputs
                      });
                    }
                  }
                }

                // Inkrementieren des totalRecipeTransformations Zählers
                if (processStep.totalRecipeTransformations == null) {
                  processStep.totalRecipeTransformations = 0;
                }
                processStep.totalRecipeTransformations++;

                // Benachrichtigung
                handleNotification(
                  processStep.name,
                  `Live Simulation: ${processStep.name}`,
                  "Transformation complete"
                );
                console.log(processStep);
              }
            }
          }
        }
      }

      // Phase 2: Outlet
      for (const location of newState.locations) {
        for (const processStep of location.processSteps) {
          const outputSpeeds = processStep.outputs.map((o) =>
            Math.min(processStep.outputSpeed, o.inputSpeed)
          );

          const itemsPerOutput = distributeRoundRobin(
            processStep.inventory.entries
              .filter((entry) =>
                this.orders.some(
                  (order) =>
                    order.id === entry.orderId &&
                    (order.status === "in_progress" ||
                      order.status === "pending")
                )
              )
              .sort((e1, e2) => e1.addedAt.getTime() - e2.addedAt.getTime()),
            outputSpeeds,
            processStep.outputs.map((o) =>
              o.filter
                ? (i: InventoryEntry) =>
                    o.filter!.entries.some((fe) => fe.material === i.material)
                : () => true
            )
          );

          for (let outIndex = 0; outIndex < itemsPerOutput.length; outIndex++) {
            let ts = processStep.outputs[outIndex];

            let entriesToAddToOutput = itemsPerOutput[outIndex].map((i) => ({
              ...i,
              addedAt: new Date(),
              inventoryId: ts.inventory.id,
            }));

            ts.inventory.entries.push(...entriesToAddToOutput);

            // Nur tatsächlich transferierte Items entfernen
            processStep.inventory.entries =
              processStep.inventory.entries.filter(
                (e) => !entriesToAddToOutput.some((eo) => eo.id === e.id)
              );
          }
        }
      }

      // Phase 3: Intake
      for (const location of newState.locations) {
        for (const processStep of location.processSteps) {
          for (const input of processStep.inputs) {
            let inputSpeed = Math.min(
              processStep.inputSpeed,
              input.outputSpeed
            );

            let inputItems = input.inventory.entries
              .filter((entry) =>
                this.orders.some(
                  (order) =>
                    order.id === entry.orderId &&
                    (order.status === "in_progress" ||
                      order.status === "pending")
                )
              )
              .sort((e1, e2) => e1.addedAt.getTime() - e2.addedAt.getTime())
              .slice(0, inputSpeed) // Verwende slice statt splice, um das Original-Array nicht zu verändern
              .map((entry) => ({
                ...entry,
                addedAt: new Date(),
                inventoryId: processStep.inventory.id,
              }));

            processStep.inventory.entries.push(...inputItems);

            input.inventory.entries = input.inventory.entries.filter(
              (e) => !inputItems.some((ie) => ie.id === e.id)
            );
          }
        }
      }
    }

    // Phase 4: Check for Completed Orders
    this.checkAndCompleteOrders(newState);

    return newState;
  }

  /**
   * Phase 0: Order Handling
   */
  private handleOrders(state: SimulationEntityState) {
    if (!this.orders || this.orders.length === 0) {
      console.warn("Keine Orders vorhanden.");
      return;
    }

    const pendingOrders = this.orders.filter(
      (order) => order.status === "pending"
    );

    for (const order of pendingOrders) {
      // Reserviere benötigte Materialien für den Auftrag
      const requiredMaterials = this.getRequiredMaterialsForOrder(order);
      if (requiredMaterials) {
        const reservationSuccess = this.reserveMaterialsForOrder(
          order,
          requiredMaterials,
          state
        );
        if (reservationSuccess) {
          order.status = "in_progress";
          handleNotification(
            "Order Status",
            `Order ${order.id} ist jetzt in Bearbeitung.`,
            "info"
          );
        } else {
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
   * Extrahiert die benötigten Materialien aus der Order.
   * Verwendet eine feste Liste von Materialien und berechnet die benötigte Menge basierend auf der Order-Quantity.
   *
   * @param order - Die Order, für die die benötigten Materialien ermittelt werden sollen.
   * @returns Ein Array von Materialnamen oder `null`, wenn die Order keine gültige Quantity hat.
   */
  private getRequiredMaterialsForOrder(order: Order): string[] | null {
    if (!order.quantity || order.quantity < 1) return null;

    // Feste Liste der benötigten Materialien pro Einheit
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

    return baseMaterials;
  }

  /**
   * Reserviert die benötigten Materialien für eine Order, indem die entsprechenden InventoryEntries markiert werden.
   * @returns true, wenn die Reservierung erfolgreich war, sonst false
   */
  private reserveMaterialsForOrder(
    order: Order,
    materials: string[],
    state: SimulationEntityState
  ): boolean {
    let allReserved = true;

    for (const material of materials) {
      const requiredQuantity = order.quantity; // 1 Stück pro Material pro Einheit multipliziert mit der Order-Quantity
      let remaining = requiredQuantity;

      for (const location of state.locations) {
        for (const processStep of location.processSteps) {
          const availableEntries = processStep.inventory.entries.filter(
            (entry) => entry.material === material && !entry.orderId
          );
          for (const entry of availableEntries) {
            if (remaining <= 0) break;
            entry.orderId = order.id;
            remaining -= 1;
          }
          if (remaining <= 0) break;
        }
        if (remaining <= 0) break;
      }

      if (remaining > 0) {
        allReserved = false;
        // Rückgängig machen der bereits vorgenommenen Reservierungen für diese Order
        for (const location of state.locations) {
          for (const processStep of location.processSteps) {
            processStep.inventory.entries.forEach((entry) => {
              if (entry.orderId === order.id && entry.material === material) {
                entry.orderId = null;
              }
            });
          }
        }
        handleNotification(
          "Order Reservation Failed",
          `Order ${order.id}: Nicht genügend Materialien für ${material} reserviert.`,
          "error"
        );
        console.warn(
          `Order ${order.id}: Nicht genügend Materialien für ${material} reserviert.`
        );
        break; // Breche die Reservierung bei einem Fehler ab
      }
    }

    return allReserved;
  }

  /**
   * Überprüft abgeschlossene Orders und aktualisiert deren Status sowie das completedAt-Feld.
   */
  private checkAndCompleteOrders(state: SimulationEntityState): void {
    // Identifizieren der Inventory IDs für den Prozessschritt "Shipping"
    const shippingInventoryIds = state.locations
      .flatMap((location) => location.processSteps)
      .filter((processStep) => processStep.name === "Shipping")
      .map((processStep) => processStep.inventory.id);

    for (const order of this.orders) {
      if (order.status !== "completed") {
        // Zählen der fertigen Sitze für diese Order in "Shipping"
        const completedSeats = state.locations
          .flatMap((location) => location.processSteps)
          .flatMap((processStep) => processStep.inventory.entries)
          .filter(
            (entry) =>
              entry.orderId === order.id &&
              this.isSeatCompleted(entry.material) &&
              shippingInventoryIds.includes(entry.inventoryId)
          ).length;

        if (completedSeats >= order.quantity) {
          // Aktualisieren des Order-Status und Setzen von completedAt
          order.status = "completed";
          order.completedAt = new Date();

          handleNotification(
            "Order Completed",
            `Order ${order.id} wurde abgeschlossen.`,
            "success"
          );

          console.log(
            `Order ${order.id} abgeschlossen. Fertige Sitze: ${completedSeats}`
          );
        }
      }
    }
  }

  /**
   * Hilfsmethode zur Bestimmung, ob ein Material einen fertigen Sitz darstellt.
   * Sie können diese Methode anpassen, um die Kriterien für einen fertigen Sitz festzulegen.
   *
   * @param material - Das Material des InventoryEntry
   * @returns true, wenn das Material einen fertigen Sitz darstellt, sonst false
   */
  private isSeatCompleted(material: string): boolean {
    // Definieren Sie, welche Materialien als fertige Sitze gelten
    const completedSeatMaterials = ["Complete Seat"];

    return completedSeatMaterials.includes(material);
  }

  /**
   * Überprüft, ob es noch aktive Orders gibt (Status: pending oder in_progress).
   * @returns true, wenn mindestens eine aktive Order existiert, sonst false.
   */
  public hasActiveOrders(): boolean {
    return this.orders.some(
      (order) => order.status === "pending" || order.status === "in_progress"
    );
  }

  /**
   * Handhabt das Stoppen der Simulation, wenn keine aktiven Orders mehr vorhanden sind.
   */
  private handleSimulationStop(): void {
    // Implementieren Sie hier die Logik zum Stoppen der Simulation
    // Zum Beispiel könnten Sie einen Callback aufrufen oder eine Benachrichtigung senden
    handleNotification(
      "Simulation Stopped",
      "Alle Orders sind abgeschlossen. Die Simulation wurde pausiert.",
      "info"
    );
    console.log("Simulation gestoppt: Keine aktiven Orders mehr vorhanden.");

    // Falls Sie Zugriff auf den Wiedergabestatus haben, setzen Sie ihn hier
    // z.B., falls Sie eine Referenz zum Frontend-Kontext haben
    // Dies erfordert eine Änderung der Klasse, um einen Callback oder Event zu unterstützen
  }

  private static objectsToReferences(state: SimulationEntityState) {
    const transportSystems = Object.fromEntries(
      state.locations
        .flatMap((l) => l.processSteps)
        .flatMap((ps) => ps.inputs.concat(ps.outputs))
        .filter((ts, i, arr) => arr.map((x) => x.id).indexOf(ts.id) === i)
        .map((ts) => [ts.id, ts])
    );

    for (const location of state.locations) {
      for (const processStep of location.processSteps) {
        processStep.inputs = processStep.inputs.map(
          (input) => transportSystems[input.id]
        );
        processStep.outputs = processStep.outputs.map(
          (output) => transportSystems[output.id]
        );
      }
    }
  }

  private static cloneState(
    state: SimulationEntityState
  ): SimulationEntityState {
    return JSON.parse(JSON.stringify(state), convertDates);
  }
}
