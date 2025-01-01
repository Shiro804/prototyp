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

  constructor(initialState: SimulationEntityState) {
    // 1) Clone the initial state so we don't mutate the original
    this.currentState = Simulation.cloneState(initialState);
    // 2) frames[0] = initial state at tick 0
    this.frames.push(Simulation.cloneState(this.currentState));
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
   * The actual logic from your old "tick()" method,
   * refactored into `computeNextTick()`.
   */
  private computeNextTick(
    oldState: SimulationEntityState
  ): SimulationEntityState {
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
              // remove consumed inputs
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
              // Increment the totalRecipeTransformations counter
              if (processStep.totalRecipeTransformations == null) {
                processStep.totalRecipeTransformations = 0;
              }
              processStep.totalRecipeTransformations++;
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
          processStep.inventory.entries.toSorted(
            (e1, e2) => e1.addedAt.getTime() - e2.addedAt.getTime()
          ),
          outputSpeeds,
          processStep.outputs.map((o) =>
            o.filter
              ? (i) =>
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

    return newState;
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
