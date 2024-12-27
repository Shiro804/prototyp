// simulationMock.ts
import { InventoryEntry, Prisma } from "@prisma/client";
import { Event } from "./events";
import { nextFreeInventoryEntryId } from "./inventories";
import { distributeRoundRobin } from "./round-robin";

/** Helper to detect ISO date strings and convert them to real Dates */
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
          };
        };
        outputs: {
          include: {
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

export interface SimulationFrame {
  state: SimulationEntityState;
  tick: number;
}

export interface SimulationRunMock {
  /** 
   * All frames from tick 0 to the last computed tick.
   * This can grow if we do runNext(10) 
   */
  frames: SimulationFrame[];
  /** 
   * Any events your logic wants to track 
   */
  events: Event[];
}

export class SimulationMock {
  /** The initial state (cloned from DB / fetch) */
  private readonly initialState: SimulationEntityState;
  private currentTick = 0;
  private currentState: SimulationEntityState;

  /** Already computed frames. Index = tick number. */
  private frames: SimulationFrame[] = [];

  /** Future frames, if precomputed, from (currentTick+1) onward. */
  private futureFrames: SimulationFrame[] = [];

  private readonly events: Event[] = [];

  /**
   * Build a mock simulation from an initial entity state (DB data).
   * We'll store the "initial" state for reference, but we also
   * immediately set that as our `currentState`.
   */
  constructor(initialState: SimulationEntityState) {
    this.initialState = SimulationMock.cloneState(initialState);
    this.currentTick = 0;

    // Current state = initial
    this.currentState = SimulationMock.cloneState(this.initialState);

    // Store frame 0 in frames
    this.frames = [
      {
        state: SimulationMock.cloneState(this.currentState),
        tick: 0,
      },
    ];
  }

  /** Return a snapshot of the entire simulation so far. */
  public getSimulationRun(): SimulationRunMock {
    return {
      frames: this.frames.concat(this.futureFrames), // frames + future
      events: this.events,
    };
  }

  /** Return the last known tick. */
  public get currentFrame(): SimulationFrame {
    return this.frames[this.frames.length - 1];
  }

  /** Return the current tick index. */
  public getCurrentTick(): number {
    return this.currentTick;
  }

  /** Reset to initial state entirely. Clears frames, events, etc. */
  public reset(): void {
    this.currentTick = 0;
    this.currentState = SimulationMock.cloneState(this.initialState);
    this.frames = [
      { state: SimulationMock.cloneState(this.currentState), tick: 0 },
    ];
    this.futureFrames = [];
    this.events.length = 0;
  }

  /**
   * If we want to discard future frames (e.g., because we changed something),
   * call this method.
   */
  public discardFutureFrames(): void {
    this.futureFrames = [];
  }

  /**
   * Precompute the next N ticks starting from the *current* state.
   * The new frames go into `futureFrames`.
   */
  public runNext(n: number) {
    // Start from the last "real" frame in frames + discard any existing future
    if (this.futureFrames.length > 0) {
      // Possibly we want to re-start from the last official frame.
      // We discard old future, because the logic might have changed.
      this.discardFutureFrames();
    }

    let baseFrame = this.frames[this.frames.length - 1];
    let baseState = SimulationMock.cloneState(baseFrame.state);

    let tickStart = baseFrame.tick;
    let newFrames: SimulationFrame[] = [];
    for (let i = 1; i <= n; i++) {
      baseState = this.computeNextTick(baseState);
      let tickNumber = tickStart + i;
      newFrames.push({ state: SimulationMock.cloneState(baseState), tick: tickNumber });
    }

    this.futureFrames = newFrames;
  }

  /**
   * Advance exactly 1 tick:
   * - If there's a precomputed future frame, we take that.
   * - Otherwise, compute a new frame from current state.
   */
  public tickForward() {
    // If futureFrames has a next tick, just shift from it:
    const nextTickIndex = this.currentTick + 1;
    const nextFrame = this.futureFrames.find((f) => f.tick === nextTickIndex);

    if (nextFrame) {
      // Use the precomputed future frame
      this.currentTick = nextFrame.tick;
      this.currentState = SimulationMock.cloneState(nextFrame.state);

      // frames grows by that 1 frame
      this.frames.push(nextFrame);

      // Remove it from futureFrames
      this.futureFrames = this.futureFrames.filter((f) => f.tick > nextTickIndex);
    } else {
      // We have to compute a new frame on the fly
      let newState = this.computeNextTick(this.currentState);
      this.currentTick += 1;
      this.currentState = SimulationMock.cloneState(newState);

      let newFrame: SimulationFrame = {
        tick: this.currentTick,
        state: SimulationMock.cloneState(this.currentState),
      };
      this.frames.push(newFrame);
    }
  }

  /**
   * This is the core logic for computing "one tick".
   * It's basically a clone of your old `tick()` method, but refactored
   * to operate on a given state and return the new state.
   */
  private computeNextTick(oldState: SimulationEntityState): SimulationEntityState {
    let newState = SimulationMock.cloneState(oldState);
    SimulationMock.objectsToReferences(newState);

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
              // BUG-FIX: you want to remove the consumed inputs, 
              // so we do 'filter(e => !inputEntries.includes(e))'
              processStep.inventory.entries =
                processStep.inventory.entries.filter(
                  (e) => !inputEntries.includes(e)
                );

              // Now add outputs
              for (const output of processStep.recipe.outputs) {
                for (let outputStep = 0; outputStep < output.quantity; outputStep++) {
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

        const entriesPerOutput = outputItems.map((o) =>
          o.map((i) => processStep.inventory.entries.find((e) => e.id === i)!)
        );

        for (let output = 0; output < outputItems.length; output++) {
          let entriesToAddToOutput = entriesPerOutput[output].map((e) => ({
            ...e,
            addedAt: new Date(),
            inventoryId: processStep.outputs[output].inventory.id,
          }));

          processStep.outputs[output].inventory.entries.push(
            ...entriesToAddToOutput
          );

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
            .map((e) => ({
              ...e,
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

  // --- Utilities ---
  private static objectsToReferences(state: SimulationEntityState) {
    const transportSystems = Object.fromEntries(
      state.locations
        .flatMap((l) => l.processSteps)
        .flatMap((ps) => ps.inputs.concat(ps.outputs))
        // Deduplicate by id
        .filter((ts, i, tss) => tss.map((e) => e.id).indexOf(ts.id) === i)
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

  private static cloneState(state: SimulationEntityState): SimulationEntityState {
    return JSON.parse(JSON.stringify(state), convertDates);
  }
}
