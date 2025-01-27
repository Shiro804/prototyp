import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Utility to create random full names
function randomFullName() {
  const firstNames = ["John", "Jane", "Alex", "Emily", "Taylor", "Sam"];
  const lastNames = ["Smith", "Doe", "Brown", "Johnson", "Davis", "Garcia"];
  const fn = firstNames[randomBetween(0, firstNames.length - 1)];
  const ln = lastNames[randomBetween(0, lastNames.length - 1)];
  return `${fn} ${ln}`;
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
  // 0.5) Create some WorkerRoles
  // -------------------------------------------------
  const [
    storageWorkerRole,
    preAssemblyWorkerRole,
    upholsteryWorkerRole,
    transportOperatorRole,
    qualityCheckerRole,
  ] = await prisma.$transaction([
    prisma.workerRole.create({ data: { name: "Storage Worker" } }),
    prisma.workerRole.create({ data: { name: "Pre-Assembly Worker" } }),
    prisma.workerRole.create({ data: { name: "Upholstery Worker" } }),
    prisma.workerRole.create({ data: { name: "Transport Operator" } }),
    prisma.workerRole.create({ data: { name: "Quality Checker" } }),
  ]);

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
  const tsForkliftHall1ToHall2 = await createTransportSystemWithFilter(
    "Forklift - Hall 1 to Hall 2 (Seat Materials)",
    hall1.processSteps.find((ps) => ps.name === "Goods Entry Point")!.id,
    hall2.processSteps.find((ps) => ps.name === "Storage Rack")!.id,
    "Forklift",
    5,
    2
  );

  // 2) "DTS - Hall 5 to Hall 2 (Covers)"
  const tsDtsHall5ToHall2 = await createTransportSystemWithFilter(
    "DTS - Hall 5 to Hall 2 (Covers)",
    hall5.processSteps.find((ps) => ps.name === "Covers Entry Point")!.id,
    hall2.processSteps.find((ps) => ps.name === "Storage Rack")!.id,
    "DTS",
    3,
    2
  );

  // 3) "Worker TS - Rack -> PreAssembly Storage"
  //    => We want NO covers => overrideMaterials
  //    => Should remain DTS, so rename type to "DTS"
  const tsDtsRackToPreAssemblyStorage = await createTransportSystemWithFilter(
    "DTS - Rack -> PreAssembly Storage",
    hall2.processSteps.find((ps) => ps.name === "Storage Rack")!.id,
    hall3.processSteps.find((ps) => ps.name === "Pre-Assembly Storage")!.id,
    "DTS",
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

  // 4) "Worker TS - PreAssemblyStorage -> Seat" => change to "Roller"
  const tsRollerPreAssemblyStorageToSeat =
    await createTransportSystemWithFilter(
      "Worker TS - PreAssemblyStorage -> Seat",
      hall3.processSteps.find((ps) => ps.name === "Pre-Assembly Storage")!.id,
      hall3.processSteps.find((ps) => ps.name === "Pre-Assembly Seat Worker")!
        .id,
      "Roller", // changed from "Worker-TS"
      1,
      1
    );

  // 5) "Worker TS - PreAssemblyStorage -> Backrest" => change to "Roller"
  const tsRollerPreAssemblyStorageToBackrest =
    await createTransportSystemWithFilter(
      "Worker TS - PreAssemblyStorage -> Backrest",
      hall3.processSteps.find((ps) => ps.name === "Pre-Assembly Storage")!.id,
      hall3.processSteps.find(
        (ps) => ps.name === "Pre-Assembly Backrest Worker"
      )!.id,
      "Roller", // changed from "Worker-TS"
      1,
      1
    );

  // 6) "Worker TS - PreAssemblySeat -> UpholsteryStorage"
  //    => keep type "Worker-TS" (unchanged)
  const tsWorkerPreAssemblySeatToUpholstery =
    await createTransportSystemWithFilter(
      "Worker TS - PreAssemblySeat -> UpholsteryStorage",
      hall3.processSteps.find((ps) => ps.name === "Pre-Assembly Seat Worker")!
        .id,
      hall3.processSteps.find((ps) => ps.name === "Upholstery Storage")!.id,
      "Worker-TS",
      1,
      2,
      {
        overrideMaterials: ["Pre-Assembled Seat"],
      }
    );

  // 7) "Worker TS - PreAssemblyBackrest -> UpholsteryStorage"
  //    => keep type "Worker-TS" (unchanged)
  const tsWorkerPreAssemblyBackrestToUpholstery =
    await createTransportSystemWithFilter(
      "Worker TS - PreAssemblyBackrest -> UpholsteryStorage",
      hall3.processSteps.find(
        (ps) => ps.name === "Pre-Assembly Backrest Worker"
      )!.id,
      hall3.processSteps.find((ps) => ps.name === "Upholstery Storage")!.id,
      "Worker-TS",
      1,
      2,
      {
        overrideMaterials: ["Pre-Assembled Backrest"],
      }
    );

  // 8) "Worker TS - Upholstery Storage -> Upholstery - Seat Worker"
  //    => change to "Roller"
  const tsRollerUpholsteryStorageToSeatWorker =
    await createTransportSystemWithFilter(
      "Worker TS - Upholstery Storage -> Upholstery - Seat Worker",
      hall3.processSteps.find((ps) => ps.name === "Upholstery Storage")!.id,
      hall3.processSteps.find((ps) => ps.name === "Upholstery - Seat Worker")!
        .id,
      "Roller", // changed from "Worker-TS"
      1,
      2,
      {
        overrideMaterials: ["Pre-Assembled Seat", "Seat Cover"],
      }
    );

  // 9) "Conveyor - Upholstery - Seat Worker -> Assembly"
  const tsConveyorUpholsterySeatToAssembly =
    await createTransportSystemWithFilter(
      "Conveyor - Upholstery - Seat Worker -> Assembly",
      hall3.processSteps.find((ps) => ps.name === "Upholstery - Seat Worker")!
        .id,
      hall4.processSteps.find((ps) => ps.name === "Assembly")!.id,
      "Conveyor",
      1,
      2
    );

  // 10) "Worker TS - Upholstery Storage -> Upholstery - Backrest Worker"
  //      => change to "Roller"
  const tsRollerUpholsteryStorageToBackrestWorker =
    await createTransportSystemWithFilter(
      "Worker TS - Upholstery Storage -> Upholstery - Backrest Worker",
      hall3.processSteps.find((ps) => ps.name === "Upholstery Storage")!.id,
      hall3.processSteps.find(
        (ps) => ps.name === "Upholstery - Backrest Worker"
      )!.id,
      "Roller", // changed from "Worker-TS"
      1,
      2,
      {
        overrideMaterials: ["Pre-Assembled Backrest", "Backrest Cover"],
      }
    );

  // 11) "Conveyor - Upholstery - Backrest Worker -> Assembly"
  const tsConveyorUpholsteryBackrestToAssembly =
    await createTransportSystemWithFilter(
      "Conveyor - Upholstery - Backrest Worker -> Assembly",
      hall3.processSteps.find(
        (ps) => ps.name === "Upholstery - Backrest Worker"
      )!.id,
      hall4.processSteps.find((ps) => ps.name === "Assembly")!.id,
      "Conveyor",
      1,
      2
    );

  // 12) "Conveyor - Assembly -> EOL"
  const tsConveyorAssemblyToEOL = await createTransportSystemWithFilter(
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

  // 14) "Forklift - EOL -> Shipping"
  const tsForkliftEOLToShipping = await createTransportSystemWithFilter(
    "Forklift - EOL -> Shipping",
    hall4.processSteps.find((ps) => ps.name === "End of Line Check")!.id,
    hall5.processSteps.find((ps) => ps.name === "Shipping")!.id,
    "Forklift",
    1,
    2
  );

  // TransportSystem für Covers vom Storage Rack (Hall2) zum Upholstery Storage (Hall3)
  // => now want a DTS type with a machine resource
  const tsDtsRackToUpholsteryStorageCovers =
    await createTransportSystemWithFilter(
      "Worker TS - Rack -> UpholsteryStorage (Covers Only)",
      hall2.processSteps.find((ps) => ps.name === "Storage Rack")!.id,
      hall3.processSteps.find((ps) => ps.name === "Upholstery Storage")!.id,
      "DTS", // changed from "Worker-TS"
      2, // minQuantity
      3, // transportDelay
      {
        overrideMaterials: ["Seat Cover", "Backrest Cover"],
      }
    );

  // 4) Create Orders
  await createMockOrders(10);

  // -------------------------------------------------
  // 5) Create Resources (Workers & Machines)
  // -------------------------------------------------

  // STORAGE RACK => 2 workers, same role
  const storageRackPS = hall2.processSteps.find(
    (ps) => ps.name === "Storage Rack"
  )!;
  for (let i = 1; i <= 2; i++) {
    await prisma.resource.create({
      data: {
        name: `Storage Rack Worker ${i}`,
        locationId: hall2.id,
        processStepId: storageRackPS.id,
        Worker: {
          create: {
            workerNumber: `STOR-${100 + i}`,
            fullName: randomFullName(),
            address: `Storage Address #${i}`,
            workerRoles: {
              connect: [{ id: storageWorkerRole.id }],
            },
          },
        },
      },
    });
  }

  // PRE-ASSEMBLY STORAGE => 2 workers, same role
  const preAssemblyStoragePS = hall3.processSteps.find(
    (ps) => ps.name === "Pre-Assembly Storage"
  )!;
  for (let i = 1; i <= 2; i++) {
    await prisma.resource.create({
      data: {
        name: `Pre-Assembly Storage Worker ${i}`,
        locationId: hall3.id,
        processStepId: preAssemblyStoragePS.id,
        Worker: {
          create: {
            workerNumber: `PASW-${200 + i}`,
            fullName: randomFullName(),
            address: `PreAssembly Storage Rd #${i}`,
            workerRoles: {
              connect: [{ id: preAssemblyWorkerRole.id }],
            },
          },
        },
      },
    });
  }

  // "Worker TS - PreAssemblyStorage -> Seat" => 1 worker, type Roller
  if (tsRollerPreAssemblyStorageToSeat) {
    await prisma.resource.create({
      data: {
        name: "Roller Operator PreAssembly->Seat",
        locationId: hall3.id,
        transportSystemId: tsRollerPreAssemblyStorageToSeat.id,
        Worker: {
          create: {
            workerNumber: `RPS-001`,
            fullName: randomFullName(),
            address: "Transport Alley #1",
            workerRoles: {
              connect: [{ id: transportOperatorRole.id }],
            },
          },
        },
      },
    });
  }

  // "Worker TS - PreAssemblyStorage -> Backrest" => 1 worker, type Roller
  if (tsRollerPreAssemblyStorageToBackrest) {
    await prisma.resource.create({
      data: {
        name: "Roller Operator PreAssembly->Backrest",
        locationId: hall3.id,
        transportSystemId: tsRollerPreAssemblyStorageToBackrest.id,
        Worker: {
          create: {
            workerNumber: `RPB-001`,
            fullName: randomFullName(),
            address: "Transport Alley #2",
            workerRoles: {
              connect: [{ id: transportOperatorRole.id }],
            },
          },
        },
      },
    });
  }

  // PS "Pre-Assembly Seat Worker" => 2 workers
  const preAssemblySeatPS = hall3.processSteps.find(
    (ps) => ps.name === "Pre-Assembly Seat Worker"
  )!;
  for (let i = 1; i <= 2; i++) {
    await prisma.resource.create({
      data: {
        name: `Pre-Assembly Seat Operator ${i}`,
        locationId: hall3.id,
        processStepId: preAssemblySeatPS.id,
        Worker: {
          create: {
            workerNumber: `PASO-S${i}`,
            fullName: randomFullName(),
            address: `SeatOperator Ln #${i}`,
            workerRoles: {
              connect: [{ id: preAssemblyWorkerRole.id }],
            },
          },
        },
      },
    });
  }

  // PS "Pre-Assembly Backrest Worker" => 2 workers
  const preAssemblyBackrestPS = hall3.processSteps.find(
    (ps) => ps.name === "Pre-Assembly Backrest Worker"
  )!;
  for (let i = 1; i <= 2; i++) {
    await prisma.resource.create({
      data: {
        name: `Pre-Assembly Backrest Operator ${i}`,
        locationId: hall3.id,
        processStepId: preAssemblyBackrestPS.id,
        Worker: {
          create: {
            workerNumber: `PASO-B${i}`,
            fullName: randomFullName(),
            address: `BackrestOperator Ln #${i}`,
            workerRoles: {
              connect: [{ id: preAssemblyWorkerRole.id }],
            },
          },
        },
      },
    });
  }

  // "Worker TS - Rack -> UpholsteryStorage (Covers Only)" => DTS with a machine
  // also each DTS at the end shall contain a machine resource => so let's add one
  if (tsDtsRackToUpholsteryStorageCovers) {
    await prisma.resource.create({
      data: {
        name: "Covers DTS Machine",
        locationId: hall2.id,
        transportSystemId: tsDtsRackToUpholsteryStorageCovers.id,
        Machine: {
          create: {},
        },
      },
    });
  }

  // For each existing DTS we can also add a machine resource if you want "at the end each DTS"
  // Minimal example: let's do it for "DTS - Rack -> PreAssembly Storage" and "DTS - Hall 5 to Hall 2 (Covers)"
  if (tsDtsRackToPreAssemblyStorage) {
    await prisma.resource.create({
      data: {
        name: "DTS Machine Rack->PreAssembly",
        locationId: hall2.id,
        transportSystemId: tsDtsRackToPreAssemblyStorage.id,
        Machine: {
          create: {},
        },
      },
    });
  }

  if (tsDtsHall5ToHall2) {
    await prisma.resource.create({
      data: {
        name: "DTS Machine Hall5->Hall2",
        locationId: hall5.id,
        transportSystemId: tsDtsHall5ToHall2.id,
        Machine: {
          create: {},
        },
      },
    });
  }

  // PS "Upholstery Storage" => 2 workers
  const upholsteryStoragePS = hall3.processSteps.find(
    (ps) => ps.name === "Upholstery Storage"
  )!;
  for (let i = 1; i <= 2; i++) {
    await prisma.resource.create({
      data: {
        name: `Upholstery Storage Worker ${i}`,
        locationId: hall3.id,
        processStepId: upholsteryStoragePS.id,
        Worker: {
          create: {
            workerNumber: `UPSW-${300 + i}`,
            fullName: randomFullName(),
            address: `Upholstery Storage Ln #${i}`,
            workerRoles: {
              connect: [{ id: upholsteryWorkerRole.id }],
            },
          },
        },
      },
    });
  }

  // "Worker TS - Upholstery Storage -> Upholstery - Seat Worker" => now Roller => 1 worker
  if (tsRollerUpholsteryStorageToSeatWorker) {
    await prisma.resource.create({
      data: {
        name: "Roller Operator UpholsteryStorage->Seat",
        locationId: hall3.id,
        transportSystemId: tsRollerUpholsteryStorageToSeatWorker.id,
        Worker: {
          create: {
            workerNumber: `RUW-S001`,
            fullName: randomFullName(),
            address: "UphTransport Alley #1",
            workerRoles: {
              connect: [{ id: transportOperatorRole.id }],
            },
          },
        },
      },
    });
  }

  // "Worker TS - Upholstery Storage -> Upholstery - Backrest Worker" => now Roller => 1 worker
  if (tsRollerUpholsteryStorageToBackrestWorker) {
    await prisma.resource.create({
      data: {
        name: "Roller Operator UpholsteryStorage->Backrest",
        locationId: hall3.id,
        transportSystemId: tsRollerUpholsteryStorageToBackrestWorker.id,
        Worker: {
          create: {
            workerNumber: `RUW-B001`,
            fullName: randomFullName(),
            address: "UphTransport Alley #2",
            workerRoles: {
              connect: [{ id: transportOperatorRole.id }],
            },
          },
        },
      },
    });
  }

  // PS "Upholstery - Seat Worker" => 2 workers
  const upholsterySeatPS = hall3.processSteps.find(
    (ps) => ps.name === "Upholstery - Seat Worker"
  )!;
  for (let i = 1; i <= 2; i++) {
    await prisma.resource.create({
      data: {
        name: `Upholstery Seat Operator ${i}`,
        locationId: hall3.id,
        processStepId: upholsterySeatPS.id,
        Worker: {
          create: {
            workerNumber: `UWS-${i}`,
            fullName: randomFullName(),
            address: `UphSeat Rd #${i}`,
            workerRoles: {
              connect: [{ id: upholsteryWorkerRole.id }],
            },
          },
        },
      },
    });
  }

  // PS "Upholstery - Backrest Worker" => 2 workers
  const upholsteryBackrestPS = hall3.processSteps.find(
    (ps) => ps.name === "Upholstery - Backrest Worker"
  )!;
  for (let i = 1; i <= 2; i++) {
    await prisma.resource.create({
      data: {
        name: `Upholstery Backrest Operator ${i}`,
        locationId: hall3.id,
        processStepId: upholsteryBackrestPS.id,
        Worker: {
          create: {
            workerNumber: `UWB-${i}`,
            fullName: randomFullName(),
            address: `UphBackrest Rd #${i}`,
            workerRoles: {
              connect: [{ id: upholsteryWorkerRole.id }],
            },
          },
        },
      },
    });
  }

  // PS "Assembly" => 2 machines ("Assembly robotic arm #1" and "#2")
  const assemblyPS = hall4.processSteps.find((ps) => ps.name === "Assembly")!;
  for (let i = 1; i <= 2; i++) {
    await prisma.resource.create({
      data: {
        name: `Assembly robotic arm ${i}`,
        locationId: hall4.id,
        processStepId: assemblyPS.id,
        Machine: {
          create: {},
        },
      },
    });
  }

  // End of Line Check => 1 machine "PhotoSystem" + 1 worker "Quality Checker"
  const eolPS = hall4.processSteps.find(
    (ps) => ps.name === "End of Line Check"
  )!;
  // Machine
  await prisma.resource.create({
    data: {
      name: "PhotoSystem",
      locationId: hall4.id,
      processStepId: eolPS.id,
      Machine: {
        create: {},
      },
    },
  });
  // Worker
  await prisma.resource.create({
    data: {
      name: "Quality Checker",
      locationId: hall4.id,
      processStepId: eolPS.id,
      Worker: {
        create: {
          workerNumber: `QC-001`,
          fullName: randomFullName(),
          address: "Quality Blvd #1",
          workerRoles: {
            connect: [{ id: qualityCheckerRole.id }],
          },
        },
      },
    },
  });

  // TS "Forklift - EOL -> Shipping" => 1 worker
  if (tsForkliftEOLToShipping) {
    await prisma.resource.create({
      data: {
        name: "Forklift Operator EOL->Shipping",
        locationId: hall4.id,
        transportSystemId: tsForkliftEOLToShipping.id,
        Worker: {
          create: {
            workerNumber: `FLEOL-001`,
            fullName: randomFullName(),
            address: "Forklift Path #1",
            workerRoles: {
              connect: [{ id: transportOperatorRole.id }],
            },
          },
        },
      },
    });
  }

  // Debug
  console.dir(
    {
      locations: await prisma.location.findMany({
        include: { processSteps: true },
      }),
      transportSystems: await prisma.transportSystem.findMany({
        include: {
          filter: { include: { entries: true } },
          sensors: true,
          resources: {
            include: {
              Worker: {
                include: { workerRoles: true },
              },
              Machine: true,
            },
          },
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
