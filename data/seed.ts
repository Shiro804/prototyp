import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Erstellt ein TransportSystem und (optional) einen Filter mit den
 * Materialien, die vom Ziel-Rezept oder expliziten overrideMaterials
 * abgeleitet werden.
 */
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
          },
          {
            name: `${name}-counter`,
            type: "counter",
            sensorDelay: 0,
            value: 0,
          },
        ],
      },
    },
    include: {
      sensors: true,
    },
  });

  // 2) ggf. Filter anlegen
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
    // Wenn overrideMaterials angegeben, nutze diese
    filterMaterials = options.overrideMaterials;
  } else if (targetStep?.recipe) {
    // Sonst nimm die Inputs vom Ziel-Rezept
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

/** Erstellt Test-Orders */
async function createMockOrders(count: number) {
  const description = "Bestellung Komplettsitz";
  for (let i = 0; i < count; i++) {
    const randomQuantity = 1;
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
  // -------------------------------------------------
  // 0) Cleanup? (Optional) => If you want to start fresh
  // await prisma.$executeRawUnsafe(`DELETE FROM ...`)

  // -------------------------------------------------
  // 1) Recipes
  // -------------------------------------------------
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
          { material: "Backrest Foam", quantity: 1 },
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

  // -------------------------------------------------
  // 2) Locations & Steps
  // -------------------------------------------------

  // 2a) Hall 1: Goods Entry
  const hall1 = await prisma.location.create({
    data: {
      name: "Hall 1 - Goods Receipt",
      processSteps: {
        create: [
          {
            name: "Goods Entry Point",
            inputSpeed: 5,
            outputSpeed: 5,
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
                      { material: "Backrest Foam" },
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

  // 2b) Hall 5: Covers Receipt + Shipping
  const hall5 = await prisma.location.create({
    data: {
      name: "Hall 5 - Covers Receipt",
      processSteps: {
        create: [
          {
            name: "Covers Entry Point",
            inputSpeed: 5,
            outputSpeed: 2,
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

  // 2c) Hall 2: Storage Rack
  const hall2 = await prisma.location.create({
    data: {
      name: "Hall 2 - Intermediate Storage (Supermarket)",
      processSteps: {
        create: [
          {
            name: "Storage Rack",
            inputSpeed: 5,
            outputSpeed: 4,
            inventory: {
              create: { type: "processStep", limit: 100 },
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

  // 2d) Hall 3: Pre-Assembly + Upholstery
  //    Steps:
  //      Pre-Assembly Storage,
  //      Pre-Assembly Seat Worker, Pre-Assembly Backrest Worker,
  //      Upholstery Storage,
  //      Upholstery - Seat Worker, Upholstery - Backrest Worker
  const hall3 = await prisma.location.create({
    data: {
      name: "Hall 3 - Pre-Assembly and Upholstery",
      processSteps: {
        create: [
          {
            name: "Pre-Assembly Storage",
            inputSpeed: 2,
            outputSpeed: 2,
            inventory: { create: { type: "processStep", limit: 20 } },
          },
          {
            name: "Pre-Assembly Seat Worker",
            inputSpeed: 2,
            outputSpeed: 1,
            duration: 5,
            recipe: { connect: { id: preAssemblyRecipeSeat.id } },
            inventory: { create: { type: "processStep", limit: 10 } },
          },
          {
            name: "Pre-Assembly Backrest Worker",
            inputSpeed: 2,
            outputSpeed: 1,
            duration: 5,
            recipe: { connect: { id: preAssemblyRecipeBackrest.id } },
            inventory: { create: { type: "processStep", limit: 10 } },
          },
          {
            name: "Upholstery Storage",
            inputSpeed: 2,
            outputSpeed: 2,
            inventory: { create: { type: "processStep", limit: 20 } },
          },
          {
            name: "Upholstery - Seat Worker",
            inputSpeed: 2,
            outputSpeed: 1,
            duration: 5,
            recipe: { connect: { id: upholsterySeatRecipe.id } },
            inventory: { create: { type: "processStep", limit: 10 } },
          },
          {
            name: "Upholstery - Backrest Worker",
            inputSpeed: 2,
            outputSpeed: 1,
            duration: 5,
            recipe: { connect: { id: upholsteryBackrestRecipe.id } },
            inventory: { create: { type: "processStep", limit: 10 } },
          },
        ],
      },
    },
    include: { processSteps: true },
  });

  // 2e) Hall 4: Assembly + EOL
  const hall4 = await prisma.location.create({
    data: {
      name: "Hall 4 - Assembly and Quality Check",
      processSteps: {
        create: [
          {
            name: "Assembly",
            inputSpeed: 2,
            outputSpeed: 1,
            recipe: { connect: { id: assemblingRecipe.id } },
            inventory: { create: { type: "processStep", limit: 5 } },
            sensors: {
              create: [
                {
                  name: "Assembly-scanner",
                  type: "scanner",
                  value: 0,
                  sensorDelay: 1,
                },
                {
                  name: "Assembly-counter",
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

  // -------------------------------------------------
  // 3) Transport Systems (mit Filtern, wenn nötig)
  // -------------------------------------------------

  // 1) "Forklift - Hall 1 to Hall 2 (Seat Materials)"
  await createTransportSystemWithFilter(
    "Forklift - Hall 1 to Hall 2 (Seat Materials)",
    hall1.processSteps.find((ps) => ps.name === "Goods Entry Point")!.id,
    hall2.processSteps.find((ps) => ps.name === "Storage Rack")!.id,
    "Forklift",
    5,
    2
  );

  // 2) "DTS - Hall 5 to Hall 2 (Covers)"
  await createTransportSystemWithFilter(
    "DTS - Hall 5 to Hall 2 (Covers)",
    hall5.processSteps.find((ps) => ps.name === "Covers Entry Point")!.id,
    hall2.processSteps.find((ps) => ps.name === "Storage Rack")!.id,
    "DTS",
    3,
    2
  );

  // 3) "Worker TS - Rack -> PreAssembly Storage"
  //    => Wir wollen KEINE Covers -> overrideMaterials
  await createTransportSystemWithFilter(
    "Worker TS - Rack -> PreAssembly Storage",
    hall2.processSteps.find((ps) => ps.name === "Storage Rack")!.id,
    hall3.processSteps.find((ps) => ps.name === "Pre-Assembly Storage")!.id,
    "Worker-TS",
    2,
    2,
    {
      overrideMaterials: [
        "Seat Structure",
        "Backrest Structure",
        "Seat Foam",
        "Backrest Foam",
        "Headrest",
        "Airbag",
        "Small Part",
      ],
    }
  );

  // 4) "Worker TS - PreAssemblyStorage -> Seat"
  //    => PreAssembly Seat Worker needs ("Seat Foam", etc.)
  //       but they've presumably arrived as raw materials in the Storage => no covers
  //    => kann optional override weglassen => minimal
  await createTransportSystemWithFilter(
    "Worker TS - PreAssemblyStorage -> Seat",
    hall3.processSteps.find((ps) => ps.name === "Pre-Assembly Storage")!.id,
    hall3.processSteps.find((ps) => ps.name === "Pre-Assembly Seat Worker")!.id,
    "Worker-TS",
    1,
    1
  );

  // 5) "Worker TS - PreAssemblyStorage -> Backrest"
  await createTransportSystemWithFilter(
    "Worker TS - PreAssemblyStorage -> Backrest",
    hall3.processSteps.find((ps) => ps.name === "Pre-Assembly Storage")!.id,
    hall3.processSteps.find((ps) => ps.name === "Pre-Assembly Backrest Worker")!
      .id,
    "Worker-TS",
    1,
    1
  );

  // 6) "Worker TS - PreAssemblySeat -> UpholsteryStorage"
  //    => Transport von "Pre-Assembled Seat" ins Upholstery Storage
  await createTransportSystemWithFilter(
    "Worker TS - PreAssemblySeat -> UpholsteryStorage",
    hall3.processSteps.find((ps) => ps.name === "Pre-Assembly Seat Worker")!.id,
    hall3.processSteps.find((ps) => ps.name === "Upholstery Storage")!.id,
    "Worker-TS",
    1,
    2,
    {
      overrideMaterials: ["Pre-Assembled Seat"],
    }
  );

  // 7) "Worker TS - PreAssemblyBackrest -> UpholsteryStorage"
  await createTransportSystemWithFilter(
    "Worker TS - PreAssemblyBackrest -> UpholsteryStorage",
    hall3.processSteps.find((ps) => ps.name === "Pre-Assembly Backrest Worker")!
      .id,
    hall3.processSteps.find((ps) => ps.name === "Upholstery Storage")!.id,
    "Worker-TS",
    1,
    2,
    {
      overrideMaterials: ["Pre-Assembled Backrest"],
    }
  );

  // 8) "Worker TS - Upholstery Storage -> Upholstery - Seat Worker"
  //    => Hier brauchen wir "Pre-Assembled Seat" + "Seat Cover"
  //       => overrideMaterials: ["Pre-Assembled Seat", "Seat Cover"]
  await createTransportSystemWithFilter(
    "Worker TS - Upholstery Storage -> Upholstery - Seat Worker",
    hall3.processSteps.find((ps) => ps.name === "Upholstery Storage")!.id,
    hall3.processSteps.find((ps) => ps.name === "Upholstery - Seat Worker")!.id,
    "Worker-TS",
    1,
    2,
    {
      overrideMaterials: ["Pre-Assembled Seat", "Seat Cover"],
    }
  );

  // 9) "Conveyor - Upholstery - Seat Worker -> Assembly"
  //    => Kein spezieller Filter, da "Upholstered Seat" das Output ist
  await createTransportSystemWithFilter(
    "Conveyor - Upholstery - Seat Worker -> Assembly",
    hall3.processSteps.find((ps) => ps.name === "Upholstery - Seat Worker")!.id,
    hall4.processSteps.find((ps) => ps.name === "Assembly")!.id,
    "Conveyor",
    1,
    2
  );

  // 10) "Worker TS - Upholstery Storage -> Upholstery - Backrest Worker"
  //     => "Pre-Assembled Backrest", "Backrest Cover"
  await createTransportSystemWithFilter(
    "Worker TS - Upholstery Storage -> Upholstery - Backrest Worker",
    hall3.processSteps.find((ps) => ps.name === "Upholstery Storage")!.id,
    hall3.processSteps.find((ps) => ps.name === "Upholstery - Backrest Worker")!
      .id,
    "Worker-TS",
    1,
    2,
    {
      overrideMaterials: ["Pre-Assembled Backrest", "Backrest Cover"],
    }
  );

  // 11) "Conveyor - Upholstery - Backrest Worker -> Assembly"
  await createTransportSystemWithFilter(
    "Conveyor - Upholstery - Backrest Worker -> Assembly",
    hall3.processSteps.find((ps) => ps.name === "Upholstery - Backrest Worker")!
      .id,
    hall4.processSteps.find((ps) => ps.name === "Assembly")!.id,
    "Conveyor",
    1,
    2
  );

  // 12) "Conveyor - Assembly -> EOL"
  await createTransportSystemWithFilter(
    "Conveyor - Assembly -> EOL",
    hall4.processSteps.find((ps) => ps.name === "Assembly")!.id,
    hall4.processSteps.find((ps) => ps.name === "End of Line Check")!.id,
    "Conveyor",
    1,
    3,
    {
      overrideMaterials: ["Complete Seat"],
    }
  );

  // 13) "Forklift - Assembly -> EOL" (optional if you want 2 ways?)
  // Skipped if you only want "Conveyor - Assembly -> EOL"

  // 14) "Forklift - EOL -> Shipping"
  // Falls du es "Assembly -> EOL" + "Forklift EOL -> Shipping" willst
  await createTransportSystemWithFilter(
    "Forklift - EOL -> Shipping",
    hall4.processSteps.find((ps) => ps.name === "End of Line Check")!.id,
    hall5.processSteps.find((ps) => ps.name === "Shipping")!.id,
    "Forklift",
    1,
    2
  );

  // TransportSystem für Covers vom Storage Rack (Hall2) zum Upholstery Storage (Hall3)
  await createTransportSystemWithFilter(
    "Worker TS - Rack -> UpholsteryStorage (Covers Only)",
    hall2.processSteps.find((ps) => ps.name === "Storage Rack")!.id,
    hall3.processSteps.find((ps) => ps.name === "Upholstery Storage")!.id,
    "Worker-TS",
    2, // minQuantity
    3, // transportDelay
    {
      overrideMaterials: ["Seat Cover", "Backrest Cover"],
    }
  );

  // 4) Create Orders
  await createMockOrders(10);

  // Debug
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
