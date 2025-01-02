import prisma from "@/data/db";
import { SimulationEntityState } from "@/lib/simulation/simulationNew";

export async function GET() {
  let state: SimulationEntityState = {
    locations: await prisma.location.findMany({
      include: {
        resources: {
          include: {
            Machine: true,
            Worker: {
              include: {
                workerRoles: true,
              },
            },
          },
        },
        processSteps: {
          include: {
            resources: {
              include: {
                Machine: true,
                Worker: {
                  include: {
                    workerRoles: true,
                  },
                },
              },
            },
            inputs: {
              include: {
                inventory: {
                  include: {
                    entries: true,
                  },
                },
                filter: {
                  include: {
                    entries: true,
                  },
                },
                orders: true
              },
            },
            outputs: {
              include: {
                inventory: {
                  include: {
                    entries: true,
                  },
                },
                filter: {
                  include: {
                    entries: true,
                  },
                },
                orders: true
              },
            },
            sensors: true,
            inventory: {
              include: {
                entries: true,
              },
            },
            recipe: {
              include: {
                inputs: true,
                outputs: true,
              },
            },
            orders: true,
          },
        },
      },
    }),
  };

  return Response.json(state);
}
