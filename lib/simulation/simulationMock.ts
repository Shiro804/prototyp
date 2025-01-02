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
            // Wichtig: Hier Filter inkl. FilterEntries laden,
            // sonst haben wir in der Simulation kein filter-Objekt.
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
            // Gleiches beim Output
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

  constructor(initialState: SimulationEntityState) {
    // Clone the initial state so we don't mutate the original
    this.initialState = SimulationMock.cloneState(initialState);
    this.currentTick = 0;
    this.currentState = SimulationMock.cloneState(this.initialState);

    // Frame 0
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
      frames: this.frames.concat(this.futureFrames),
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
   */
  public runNext(n: number) {
    if (this.futureFrames.length > 0) {
      this.discardFutureFrames();
    }

    let baseFrame = this.frames[this.frames.length - 1];
    let baseState = SimulationMock.cloneState(baseFrame.state);

    let tickStart = baseFrame.tick;
    let newFrames: SimulationFrame[] = [];
    for (let i = 1; i <= n; i++) {
      baseState = this.computeNextTick(baseState);
      let tickNumber = tickStart + i;
      newFrames.push({
        state: SimulationMock.cloneState(baseState),
        tick: tickNumber,
      });
    }

    this.futureFrames = newFrames;
  }

  public jumpToTick(targetTick: number): void {
    // a) clamp für negative Eingaben
    if (targetTick < 0) {
      targetTick = 0;
    }

    const lastFrame = this.frames[this.frames.length - 1];
    const currentMaxTick = lastFrame.tick;

    // b) Vorwärts (z.B. von 3 auf 100)
    if (targetTick > currentMaxTick) {
      const missing = targetTick - currentMaxTick;

      // Wir verwerfen alte futureFrames komplett,
      // falls die vorhanden sind (z.B. aus einer alten Vorberechnung).
      this.discardFutureFrames();

      // Dann rechnen wir die fehlenden Ticks gleich *richtig* in this.frames
      for (let i = 1; i <= missing; i++) {
        this.tickForward();
        // Achtung: tickForward() fügt jeweils EINE Frame in this.frames hinzu.
        // => Nach missing Iterationen sind wir bei tick = targetTick.
      } // c) Rückwärts (z.B. von 100 auf 3)
    } else if (targetTick < currentMaxTick) {
      // Frames oberhalb targetTick wegschneiden
      this.frames = this.frames.filter((f) => f.tick <= targetTick);

      // Neuer "letzter" Frame ist dann frames[targetTick].
      const newLast = this.frames[this.frames.length - 1];
      this.currentTick = newLast.tick;
      this.currentState = SimulationMock.cloneState(newLast.state);

      // futureFrames auch verwerfen
      this.discardFutureFrames();
    }
    // d) Falls targetTick == currentMaxTick, machen wir einfach nichts weiter
    //    (wir sind ja schon dort).

    // Zuletzt:
    // this.frames[this.frames.length-1] ist jetzt unser echter aktueller Frame
  }

  /**
   * Advance exactly 1 tick:
   * - If there's a precomputed future frame, we use that.
   * - Otherwise, compute a new frame from the current state.
   */
  public tickForward() {
    const nextTickIndex = this.currentTick + 1;
    const nextFrame = this.futureFrames.find((f) => f.tick === nextTickIndex);

    if (nextFrame) {
      // Use precomputed
      this.currentTick = nextFrame.tick;
      this.currentState = SimulationMock.cloneState(nextFrame.state);
      this.frames.push(nextFrame);
      this.futureFrames = this.futureFrames.filter(
        (f) => f.tick > nextTickIndex
      );
    } else {
      // On the fly
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
   * The core logic for computing "one tick".
   */
  private computeNextTick(
    oldState: SimulationEntityState
  ): SimulationEntityState {
    let newState = SimulationMock.cloneState(oldState);
    SimulationMock.objectsToReferences(newState);

    // Phase 1: Production
    for (const location of newState.locations) {
      console.log("Location", location);
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
                for (
                  let outputStep = 0;
                  outputStep < output.quantity;
                  outputStep++
                ) {
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
            }
          }
        }
      }
    }

    // Phase 2: Outlet
    for (const location of newState.locations) {
      for (const processStep of location.processSteps) {
        // Nur aktive Transport-Systeme sollen auch tatsächlich Items bekommen
        const outputs = processStep.outputs.filter((o) => o.active);

        const outputSpeeds = outputs.map((o) =>
          Math.min(processStep.outputSpeed, o.inputSpeed)
        );

        const itemsPerOutput = distributeRoundRobin(
          processStep.inventory.entries.toSorted(
            (e1, e2) => e1.addedAt.getTime() - e2.addedAt.getTime()
          ),
          outputSpeeds,
          outputs.map((o) =>
            o.filter
              ? (i) =>
                  o.filter!.entries.some((fe) => fe.material === i.material)
              : () => true
          )
        );

        for (let outIndex = 0; outIndex < itemsPerOutput.length; outIndex++) {
          let transportSystem = outputs[outIndex];

          let entriesToAddToOutput = itemsPerOutput[outIndex].map((e) => ({
            ...e,
            addedAt: new Date(),
            inventoryId: transportSystem.inventory.id,
          }));

          transportSystem.inventory.entries.push(...entriesToAddToOutput);

          // Vom processStep.inventory entfernen nur die Items,
          // die tatsächlich in den TS gewandert sind.
          processStep.inventory.entries = processStep.inventory.entries.filter(
            (e) => !entriesToAddToOutput.some((eo) => eo.id === e.id)
          );
        }
      }
    }

    // Phase 3: Intake
    for (const location of newState.locations) {
      for (const processStep of location.processSteps) {
        for (const input of processStep.inputs.filter((i) => i.active)) {
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
    // TransportSystems deduziert
    const transportSystems = Object.fromEntries(
      state.locations
        .flatMap((l) => l.processSteps)
        .flatMap((ps) => ps.inputs.concat(ps.outputs))
        .filter((ts, i, arr) => arr.map((x) => x.id).indexOf(ts.id) === i)
        .map((ts) => [ts.id, ts])
    );

    // replace references
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

  /**
   * NEU: Toggelt das `active`-Flag eines TransportSystems direkt im aktuellen State
   * und verwirft anschließend die "futureFrames".
   */
  public toggleTransportSystem(tsId: number): void {
    // 1) Letztes Frame
    const lastFrame = this.frames[this.frames.length - 1];
    const { locations } = lastFrame.state;

    // 2) Alle TS zusammensuchen
    const allSteps = locations.flatMap((loc) => loc.processSteps);
    const allTS = allSteps.flatMap((step) => [...step.inputs, ...step.outputs]);

    // 3) toggle
    const foundTS = allTS.find((ts) => ts.id === tsId);
    if (foundTS) {
      foundTS.active = !foundTS.active;
      console.log("Toggle TS", foundTS.name, foundTS.id, "->", foundTS.active);
    }

    // 4) Future Frames verwerfen
    this.discardFutureFrames();

    // 5) (WICHTIG) `this.currentState` soll denselben Stand wie lastFrame.state haben
    this.currentState = SimulationMock.cloneState(lastFrame.state);
  }
}
