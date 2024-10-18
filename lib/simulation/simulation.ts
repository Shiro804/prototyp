import { InventoryEntry, Prisma, TransportSystem } from "@prisma/client";
import { Event } from "./events";

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

    // Phase 1: Inventory intake

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

    // Phase 2: Production

    // Phase 3: Outlet
  }
}
