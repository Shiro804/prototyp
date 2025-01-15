import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function createTransportSystemWithFilter(
  name: string,
  fromStepId: number,
  toStepId: number,
  type: string,
  minQuantity?: number,
  transportDelay?: number,
  options?: {
    overrideMaterials?: string[];
  },
  orderId?: number
) {
  // 1) TransportSystem anlegen
  const transportSystem = await prisma.transportSystem.create({
    data: {
      name,
      inputSpeed: 2,
      outputSpeed: 2,
      type,
      inventory: { create: { type: "transportSystem", limit: 10 } },
      startStep: { connect: { id: fromStepId } },
      endStep: { connect: { id: toStepId } },
      transportDelay,
      minQuantity,
      sensors: {
        create: [
          {
            name: `${name}-scanner`,
            type: "scanner",
            sensorDelay: 1,
            value: 0,
            // materialList: "[]", // if we store logs as JSON
          },
          {
            name: `${name}-counter`,
            type: "counter",
            sensorDelay: 0,
            value: 0,
            // materialList: "[]",
          },
        ],
      },
    },
    include: {
      sensors: true,
    },
  });

  // 2) ggf. Filter
  const targetStep = await prisma.processStep.findUnique({
    where: { id: toStepId },
    include: {
      recipe: {
        include: { inputs: true },
      },
    },
  });

  let filterMaterials: string[] = [];
  if (options?.overrideMaterials?.length) {
    filterMaterials = options.overrideMaterials;
  } else if (targetStep?.recipe) {
    filterMaterials = targetStep.recipe.inputs.map((ri) => ri.material);
  }
  if (filterMaterials.length > 0) {
    const uniqueMaterials = Array.from(new Set(filterMaterials));
    await prisma.filter.create({
      data: {
        transportSystem: { connect: { id: transportSystem.id } },
        entries: {
          create: uniqueMaterials.map((material) => ({ material })),
        },
        orderId: orderId,
      },
    });
  }
  return transportSystem;
}

async function createMockOrders(count: number) {
  const description = "Bestellung Komplettsitz";
  for (let i = 0; i < count; i++) {
    const randomQuantity = randomBetween(1, 2);
    await prisma.order.create({
      data: {
        status: "pending",
        priority: 1,
        description,
        quantity: randomQuantity,
      },
    });
  }
}

async function main() {
  // Recipes
  const preAssemblyRecipeSeat = await prisma.recipe.create({
    data: {
      name: "Pre-Assembly - Seat Recipe",
      inputs: {
        create: [
          { material: "Seat Foam", quantity: 1 },
          { material: "Seat Structure", quantity: 1 },
          { material: "Airbag", quantity: 1 },
          { material: "Small Part", quantity: 1 },
        ],
      },
      outputs: {
        create: [{ material: "Pre-Assembled Seat", quantity: 1 }],
      },
    },
  });

  const preAssemblyRecipeBackrest = await prisma.recipe.create({
    data: {
      name: "Pre-Assembly - Backrest Recipe",
      inputs: {
        create: [
          { material: "Headrest", quantity: 1 },
          { material: "Backrest Structure", quantity: 1 },
        ],
      },
      outputs: {
        create: [{ material: "Pre-Assembled Backrest", quantity: 1 }],
      },
    },
  });

  const upholsterySeatRecipe = await prisma.recipe.create({
    data: {
      name: "Upholstery - Seat Recipe",
      inputs: {
        create: [
          { material: "Pre-Assembled Seat", quantity: 1 },
          { material: "Seat Cover", quantity: 1 },
        ],
      },
      outputs: {
        create: [{ material: "Upholstered Seat", quantity: 1 }],
      },
    },
  });

  const upholsteryBackrestRecipe = await prisma.recipe.create({
    data: {
      name: "Upholstery - Backrest Recipe",
      inputs: {
        create: [
          { material: "Pre-Assembled Backrest", quantity: 1 },
          { material: "Backrest Cover", quantity: 1 },
        ],
      },
      outputs: {
        create: [{ material: "Upholstered Backrest", quantity: 1 }],
      },
    },
  });

  const assemblingRecipe = await prisma.recipe.create({
    data: {
      name: "Final Assembly Recipe",
      inputs: {
        create: [
          { material: "Upholstered Seat", quantity: 1 },
          { material: "Upholstered Backrest", quantity: 1 },
        ],
      },
      outputs: {
        create: [{ material: "Complete Seat", quantity: 1 }],
      },
    },
  });

  const materialQuantity = 100;

  // Hall 1
  const hall1 = await prisma.location.create({
    data: {
      name: "Hall 1 - Goods Receipt",
      processSteps: {
        create: [
          {
            name: "Goods Entry Point",
            inputSpeed: 5,
            outputSpeed: 5,
            status: "PROCEEDING",
            inventory: {
              create: {
                type: "processStep",
                limit: 1000,
                entries: {
                  create: Array(materialQuantity)
                    .fill(0)
                    .flatMap(() => [
                      { material: "Seat Structure" },
                      { material: "Backrest Structure" },
                      { material: "Seat Foam" },
                      { material: "Headrest" },
                      { material: "Airbag" },
                      { material: "Small Part" },
                    ]),
                },
              },
            },
            sensors: {
              create: [
                {
                  name: "GoodsEntryPoint-scanner",
                  type: "scanner",
                  value: 0,
                  sensorDelay: 1,
                },
                {
                  name: "GoodsEntryPoint-counter",
                  type: "counter",
                  value: 0,
                  sensorDelay: 0,
                },
              ],
            },
          },
        ],
      },
    },
    include: {
      processSteps: true,
    },
  });

  // Hall 5
  const hall5 = await prisma.location.create({
    data: {
      name: "Hall 5 - Covers Receipt",
      processSteps: {
        create: [
          {
            name: "Covers Entry Point",
            inputSpeed: 5,
            outputSpeed: 2,
            status: "PROCEEDING",
            inventory: {
              create: {
                type: "processStep",
                limit: 400,
                entries: {
                  create: Array(materialQuantity)
                    .fill(0)
                    .flatMap(() => [
                      { material: "Seat Cover" },
                      { material: "Backrest Cover" },
                    ]),
                },
              },
            },
            sensors: {
              create: [
                {
                  name: "CoversEntryPoint-scanner",
                  type: "scanner",
                  value: 0,
                  sensorDelay: 1,
                },
                {
                  name: "CoversEntryPoint-counter",
                  type: "counter",
                  value: 0,
                  sensorDelay: 0,
                },
              ],
            },
          },
          {
            name: "Shipping",
            inputSpeed: 5,
            outputSpeed: 5,
            status: "PROCEEDING",
            inventory: {
              create: {
                type: "processStep",
                limit: 500,
              },
            },
            sensors: {
              create: [
                {
                  name: "Shipping-scanner",
                  type: "scanner",
                  value: 0,
                  sensorDelay: 1,
                },
                {
                  name: "Shipping-counter",
                  type: "counter",
                  value: 0,
                  sensorDelay: 0,
                },
              ],
            },
          },
        ],
      },
    },
    include: {
      processSteps: true,
    },
  });

  // Hall 2
  const hall2 = await prisma.location.create({
    data: {
      name: "Hall 2 - Intermediate Storage (Supermarket)",
      processSteps: {
        create: [
          {
            name: "Storage Rack",
            inputSpeed: 5,
            outputSpeed: 4,
            status: "PROCEEDING",
            inventory: {
              create: {
                type: "processStep",
                limit: 100,
              },
            },
            sensors: {
              create: [
                {
                  name: "StorageRack-scanner",
                  type: "scanner",
                  value: 0,
                  sensorDelay: 1,
                },
                {
                  name: "StorageRack-counter",
                  type: "counter",
                  value: 0,
                  sensorDelay: 0,
                },
              ],
            },
          },
        ],
      },
    },
    include: {
      processSteps: true,
    },
  });

  // Hall 3
  const hall3 = await prisma.location.create({
    data: {
      name: "Hall 3 - Pre-Assembly and Upholstery",
      processSteps: {
        create: [
          {
            name: "Pre-Assembly - Seat",
            inputSpeed: 2,
            outputSpeed: 1,
            status: "PROCEEDING",
            recipe: { connect: { id: preAssemblyRecipeSeat.id } },
            inventory: { create: { type: "processStep", limit: 10 } },
            sensors: {
              create: [
                {
                  name: "PreAssemblySeat-scanner",
                  type: "scanner",
                  value: 0,
                  sensorDelay: 1,
                },
                {
                  name: "PreAssemblySeat-counter",
                  type: "counter",
                  value: 0,
                  sensorDelay: 0,
                },
              ],
            },
          },
          {
            name: "Pre-Assembly - Backrest",
            inputSpeed: 2,
            outputSpeed: 1,
            status: "PROCEEDING",
            recipe: { connect: { id: preAssemblyRecipeBackrest.id } },
            inventory: { create: { type: "processStep", limit: 10 } },
            sensors: {
              create: [
                {
                  name: "PreAssemblyBackrest-scanner",
                  type: "scanner",
                  value: 0,
                  sensorDelay: 1,
                },
                {
                  name: "PreAssemblyBackrest-counter",
                  type: "counter",
                  value: 0,
                  sensorDelay: 0,
                },
              ],
            },
          },
          {
            name: "Upholstery - Seat",
            inputSpeed: 2,
            outputSpeed: 1,
            status: "PROCEEDING",
            recipe: { connect: { id: upholsterySeatRecipe.id } },
            inventory: { create: { type: "processStep", limit: 10 } },
            sensors: {
              create: [
                {
                  name: "UpholsterySeat-scanner",
                  type: "scanner",
                  value: 0,
                  sensorDelay: 1,
                },
                {
                  name: "UpholsterySeat-counter",
                  type: "counter",
                  value: 0,
                  sensorDelay: 0,
                },
              ],
            },
          },
          {
            name: "Upholstery - Backrest",
            inputSpeed: 2,
            outputSpeed: 1,
            status: "PROCEEDING",
            recipe: { connect: { id: upholsteryBackrestRecipe.id } },
            inventory: { create: { type: "processStep", limit: 10 } },
            sensors: {
              create: [
                {
                  name: "UpholsteryBackrest-scanner",
                  type: "scanner",
                  value: 0,
                  sensorDelay: 1,
                },
                {
                  name: "UpholsteryBackrest-counter",
                  type: "counter",
                  value: 0,
                  sensorDelay: 0,
                },
              ],
            },
          },
        ],
      },
    },
    include: { processSteps: true },
  });

  // Hall 4
  const hall4 = await prisma.location.create({
    data: {
      name: "Hall 4 - Assembly and Quality Check",
      processSteps: {
        create: [
          {
            name: "Assembling",
            inputSpeed: 2,
            outputSpeed: 1,
            status: "PROCEEDING",
            inventory: { create: { type: "processStep", limit: 5 } },
            recipe: { connect: { id: assemblingRecipe.id } },
            sensors: {
              create: [
                {
                  name: "Assembling-scanner",
                  type: "scanner",
                  value: 0,
                  sensorDelay: 1,
                },
                {
                  name: "Assembling-counter",
                  type: "counter",
                  value: 0,
                  sensorDelay: 0,
                },
              ],
            },
          },
          {
            name: "End of Line Check",
            inputSpeed: 2,
            outputSpeed: 1,
            status: "PROCEEDING",
            inventory: { create: { type: "processStep", limit: 5 } },
            sensors: {
              create: [
                {
                  name: "EndOfLineCheck-scanner",
                  type: "scanner",
                  value: 0,
                  sensorDelay: 1,
                },
                {
                  name: "EndOfLineCheck-counter",
                  type: "counter",
                  value: 0,
                  sensorDelay: 0,
                },
              ],
            },
          },
        ],
      },
    },
    include: {
      processSteps: true,
    },
  });

  // Now create Transport Systems
  await createTransportSystemWithFilter(
    "Forklift - Hall 1 to Hall 2 (Seat Materials)",
    hall1.processSteps.find((ps) => ps.name === "Goods Entry Point")!.id,
    hall2.processSteps.find((ps) => ps.name === "Storage Rack")!.id,
    "Forklift",
    5,
    2
  );

  await createTransportSystemWithFilter(
    "DTS - Hall 5 to Hall 2 (Covers)",
    hall5.processSteps.find((ps) => ps.name === "Covers Entry Point")!.id,
    hall2.processSteps.find((ps) => ps.name === "Storage Rack")!.id,
    "DTS",
    3,
    2
  );

  await createTransportSystemWithFilter(
    "DTS - Hall 2 (Storage Rack) to Pre-Assembly (Seat)",
    hall2.processSteps.find((ps) => ps.name === "Storage Rack")!.id,
    hall3.processSteps.find((ps) => ps.name === "Pre-Assembly - Seat")!.id,
    "DTS",
    2,
    2
  );

  await createTransportSystemWithFilter(
    "DTS - Hall 2 (Storage Rack) to Pre-Assembly (Backrest)",
    hall2.processSteps.find((ps) => ps.name === "Storage Rack")!.id,
    hall3.processSteps.find((ps) => ps.name === "Pre-Assembly - Backrest")!.id,
    "DTS",
    2,
    2
  );

  await createTransportSystemWithFilter(
    "Roller - Pre-Assembly (Seat) to Upholstery (Seat)",
    hall3.processSteps.find((ps) => ps.name === "Pre-Assembly - Seat")!.id,
    hall3.processSteps.find((ps) => ps.name === "Upholstery - Seat")!.id,
    "Roller",
    1,
    1
  );

  await createTransportSystemWithFilter(
    "Roller - Pre-Assembly (Backrest) to Upholstery (Backrest)",
    hall3.processSteps.find((ps) => ps.name === "Pre-Assembly - Backrest")!.id,
    hall3.processSteps.find((ps) => ps.name === "Upholstery - Backrest")!.id,
    "Roller",
    1,
    1
  );

  await createTransportSystemWithFilter(
    "Roller - Storage Rack to Upholstery (Backrest)",
    hall2.processSteps.find((ps) => ps.name === "Storage Rack")!.id,
    hall3.processSteps.find((ps) => ps.name === "Upholstery - Backrest")!.id,
    "Roller",
    2,
    2
  );

  await createTransportSystemWithFilter(
    "Roller - Storage Rack to Upholstery (Seat)",
    hall2.processSteps.find((ps) => ps.name === "Storage Rack")!.id,
    hall3.processSteps.find((ps) => ps.name === "Upholstery - Seat")!.id,
    "Roller",
    2,
    2
  );

  await createTransportSystemWithFilter(
    "Conveyor - Upholstery (Seat) to Assembling",
    hall3.processSteps.find((ps) => ps.name === "Upholstery - Seat")!.id,
    hall4.processSteps.find((ps) => ps.name === "Assembling")!.id,
    "Conveyor",
    1,
    2
  );

  await createTransportSystemWithFilter(
    "Conveyor - Upholstery (Backrest) to Assembling",
    hall3.processSteps.find((ps) => ps.name === "Upholstery - Backrest")!.id,
    hall4.processSteps.find((ps) => ps.name === "Assembling")!.id,
    "Conveyor",
    1,
    2
  );

  await createTransportSystemWithFilter(
    "Conveyor - Assembling to End of Line Check",
    hall4.processSteps.find((ps) => ps.name === "Assembling")!.id,
    hall4.processSteps.find((ps) => ps.name === "End of Line Check")!.id,
    "Conveyor",
    1,
    3,
    {
      overrideMaterials: ["Complete Seat"],
    }
  );

  await createTransportSystemWithFilter(
    "Forklift - Hall 4 (EOL) to Hall 5 (Shipping)",
    hall4.processSteps.find((ps) => ps.name === "End of Line Check")!.id,
    hall5.processSteps.find((ps) => ps.name === "Shipping")!.id,
    "Forklift",
    1,
    2
  );

  await createMockOrders(10);

  // Print out final data
  console.dir(
    {
      locations: await prisma.location.findMany({
        include: { processSteps: true },
      }),
      transportSystems: await prisma.transportSystem.findMany({
        include: {
          filter: {
            include: { entries: true },
          },
          sensors: true,
        },
      }),
    },
    { depth: 10 }
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
