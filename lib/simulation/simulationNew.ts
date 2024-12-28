// simulationNew.ts
import { InventoryEntry, Prisma } from "@prisma/client";
import { Event } from "./events";
import { nextFreeInventoryEntryId } from "./inventories";
import { distributeRoundRobin } from "./round-robin";

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
            filter: {
              include: {
                entries: true;
              };
            };
            inventory: {
              include: {
                entries: true;
              };
            };
          };
        };
        outputs: {
          include: {
            filter: {
              include: {
                entries: true;
              };
            };
            inventory: {
              include: {
                entries: true;
              };
            };
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

export class Simulation {
  private readonly initialState: SimulationEntityState;

  private readonly events: Event[] = [];
  private readonly frames: SimulationEntityState[] = [];

  constructor(initialState: SimulationEntityState) {
    this.initialState = Simulation.cloneState(initialState);
  }

  public run(ticks: number): SimulationRun {
    // Frame 0
    let firstFrame = Simulation.cloneState(this.initialState);
    this.frames.push(firstFrame);

    for (let i = 1; i < ticks; i++) {
      this.tick();
    }

    return {
      events: this.events,
      frames: this.frames,
    };
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

  public tick() {
    let oldState = this.frames.at(-1);
    if (!oldState) {
      throw new Error("No initial frame present.");
    }

    let newState = Simulation.cloneState(oldState);
    Simulation.objectsToReferences(newState);

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
                  possibleInputEntries.push(entry);
                }

                if (possibleInputEntries.length >= recipeInput.quantity) {
                  break;
                }
              }

              if (possibleInputEntries.length >= recipeInput.quantity) {
                inputEntries.push(...possibleInputEntries);
              } else {
                inputsFulfilled = false;
              }
            }

            if (inputsFulfilled) {
              // Beispiel: richtige Variante -> remove consumed
              processStep.inventory.entries =
                processStep.inventory.entries.filter(
                  (e) => !inputEntries.includes(e)
                );

              // add outputs
              for (const output of processStep.recipe.outputs) {
                for (let i = 0; i < output.quantity; i++) {
                  processStep.inventory.entries.push({
                    id: nextFreeInventoryEntryId(newState),
                    addedAt: new Date(),
                    inventoryId: processStep.inventory.id,
                    material: output.material,
                  });
                }
              }
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

        const outputItems = distributeRoundRobin(
          processStep.inventory.entries
            .toSorted((e1, e2) => e1.addedAt.getTime() - e2.addedAt.getTime())
            .map((e) => e.id),
          outputSpeeds
        );

        const entriesPerOutput = outputItems.map((idsForThatOutput) =>
          idsForThatOutput.map(
            (id) => processStep.inventory.entries.find((e) => e.id === id)!
          )
        );

        for (let outIndex = 0; outIndex < entriesPerOutput.length; outIndex++) {
          let ts = processStep.outputs[outIndex];
          const filterEntries = ts.filter?.entries ?? [];
          const allowedMaterials = filterEntries.map((fe) => fe.material);

          // Filtern nach erlaubten Materials
          let relevantItems = entriesPerOutput[outIndex].filter((item) => {
            if (allowedMaterials.length === 0) return true;
            return allowedMaterials.includes(item.material);
          });

          let entriesToAddToOutput = relevantItems.map((e) => ({
            ...e,
            addedAt: new Date(),
            inventoryId: ts.inventory.id,
          }));

          ts.inventory.entries.push(...entriesToAddToOutput);

          // Nur tatsächlich transferierte Items entfernen
          processStep.inventory.entries = processStep.inventory.entries.filter(
            (e) => !entriesToAddToOutput.some((eo) => eo.id === e.id)
          );
        }
      }
    }

    // Phase 3: Intake
    for (const location of newState.locations) {
      for (const processStep of location.processSteps) {
        for (const input of processStep.inputs) {
          let inputSpeed = Math.min(processStep.inputSpeed, input.outputSpeed);

          let inputItems = input.inventory.entries
            .toSorted((e1, e2) => e1.addedAt.getTime() - e2.addedAt.getTime())
            .splice(0, inputSpeed)
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

    // Phase 4: Add newState to frames
    this.frames.push(newState);
  }
}
