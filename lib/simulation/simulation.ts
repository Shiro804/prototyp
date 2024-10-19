import { InventoryEntry, Prisma } from "@prisma/client";
import { Event } from "./events";
import { distributeRoundRobin } from "./round-robin";

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
    genericInventories: {
      include: {
        entries: true;
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

export interface SimulationRun {
  frames: SimulationEntityState[];
  events: Event[];
}

interface InventoryModification {
  inventoryId: number;
  entriesToAdd?: InventoryEntry[];
  entriesToRemove?: number[];
}

export class Simulation {
  private readonly initialState: SimulationEntityState;

  private readonly events: Event[] = [];
  private readonly frames: SimulationEntityState[] = [];

  constructor(initialState: SimulationEntityState) {
    this.initialState = Simulation.cloneState(initialState);
  }

  public run(ticks: number): SimulationRun {
    for (let i = 0; i < ticks; i++) {
      this.tick();
    }

    return {
      events: this.events,
      frames: this.frames,
    };
  }

  private static cloneState(
    state: SimulationEntityState
  ): SimulationEntityState {
    return JSON.parse(JSON.stringify(state));
  }

  private static objectsToReferences(state: SimulationEntityState) {
    // Transform transport systems to references
    const transportSystems = Object.fromEntries(
      state.locations
        .flatMap((l) => l.processSteps)
        .flatMap((ps) => ps.inputs.concat(ps.outputs))
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

  private tick() {
    let oldState = this.frames.at(-1) ?? this.initialState;
    let newState = Simulation.cloneState(oldState);
    Simulation.objectsToReferences(newState);

    const inventoryModifications: InventoryModification[] = [];

    // Phase 1: Outlet

    for (const location of newState.locations) {
      for (const processStep of location.processSteps) {
        const outputIds = processStep.outputs.map((o) => o.id);
        const outputSpeeds = processStep.outputs.map((o) =>
          Math.min(processStep.outputSpeed, o.inputSpeed)
        );

        const itemsPerOutput = distributeRoundRobin(
          processStep.inventory.entries
            .toSorted((e1, e2) => e1.addedAt.getTime() - e2.addedAt.getTime())
            .map((e) => e.id),
          outputSpeeds
        );

        for (let output = 0; output < itemsPerOutput.length; output++) {
          inventoryModifications.push({
            inventoryId: processStep.inventory.id,
            entriesToRemove: itemsPerOutput[output],
          });
        }

        // for (let total = 0; total < itemsLeft; total++) {
        //   for (let item = 0; item < processStep.inventory.entries.length; item++) {

        //   }
        // }

        for (const output of processStep.outputs) {
          let outputSpeed = Math.min(
            processStep.outputSpeed,
            output.outputSpeed
          );
          let outputItems = input.inventory.entries
            .toSorted((e1, e2) => e1.addedAt.getTime() - e2.addedAt.getTime())
            .splice(0, inputSpeed)
            .map((e) => ({ ...e, addedAt: new Date() }));

          processStep.inventory.entries.push(...inputItems);
        }
      }
    }

    // Phase 2: Production

    for (const location of newState.locations) {
      for (const processSteps of location.processSteps) {
        for (const input of processSteps.inputs) {
          let inputSpeed = Math.min(processSteps.inputSpeed, input.outputSpeed);
          let inputItems = input.inventory.entries
            .toSorted((e1, e2) => e1.addedAt.getTime() - e2.addedAt.getTime())
            .splice(0, inputSpeed)
            .map((e) => ({ ...e, addedAt: new Date() }));

          processSteps.inventory.entries.push(...inputItems);
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
            .map((e) => ({ ...e, addedAt: new Date() }));

          processStep.inventory.entries.push(...inputItems);
        }
      }
    }
  }
}
