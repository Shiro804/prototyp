import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Hilfsfunktion für zufällige Zahlen, wird aber hier nicht weiter genutzt.
 */
function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Erstellt ein TransportSystem zwischen zwei ProcessSteps
 * und legt (falls das "to"-ProcessStep ein Rezept hat) direkt einen Filter an,
 * der genau jene Materialien akzeptiert, die im Rezept des Ziel-Schritts
 * als Input definiert sind.
 */
async function createTransportSystemWithFilter(
  name: string,
  fromStepId: number,
  toStepId: number,
  options?: {
    // materials, die manuell eingetragen werden sollen (statt der Recipe-Inputs).
    // Falls wir beides wollen (Recipe + overrides), könnten wir eine zweite Liste einführen
    // oder einen bool „mergeRecipeInputs“.
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
      inventory: { create: { type: "transportSystem", limit: 1000 } },
      startStep: { connect: { id: fromStepId } },
      endStep: { connect: { id: toStepId } },
    },
  });

  // 2) Prüfen, ob das Ziel ("to") ein Recipe hat
  const targetStep = await prisma.processStep.findUnique({
    where: { id: toStepId },
    include: {
      recipe: {
        include: { inputs: true },
      },
    },
  });

  // 3) Filter-Materialien bestimmen
  // Falls `options?.overrideMaterials` vorhanden sind, nehmen wir diese –
  // sonst (Standardfall) lesen wir das Ziel-Recipe.
  let filterMaterials: string[] = [];
  if (options?.overrideMaterials?.length) {
    // a) explizite Liste verwenden
    filterMaterials = options.overrideMaterials;
  } else if (targetStep?.recipe) {
    // b) Materialien aus dem Recipe
    filterMaterials = targetStep.recipe.inputs.map((ri) => ri.material);
  }

  // Falls wir kein Rezept haben und keine overrideMaterials, legen wir keinen Filter an
  // (d.h. das TransportSystem transportiert ALLES).
  if (filterMaterials.length > 0) {
    // Dubletten entfernen, falls z.B. recipe doppelte Inputs hatte
    const uniqueMaterials = Array.from(new Set(filterMaterials));

    // Filter in DB anlegen
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

// --- Mock Orders erstellen ---
async function createMockOrders(count: number) {
  const description = "Bestellung Komplettsitz";

  for (let i = 0; i < count; i++) {
    // const randomQuantity = randomBetween(1, 5);
    const randomQuantity = randomBetween(1, 2);

    await prisma.order.create({
      data: {
        status: "pending",
        priority: 1,
        description: description,
        quantity: randomQuantity,
        // dueDate wird hier nicht gesetzt, da es optional ist
        // Beziehungen zu anderen Modellen können hier hinzugefügt werden, falls gewünscht
      },
    });
  }
}

async function main() {
  // --- Recipes anlegen ---
  const preAssemblyRecipeSeat = await prisma.recipe.create({
    data: {
      name: "Pre-Assembly - Seat Recipe",
      inputs: {
        create: [
          { material: "Seat Foam", quantity: 1 },
          { material: "Seat Structures", quantity: 1 },
          { material: "Airbags", quantity: 1 },
          { material: "Small Parts", quantity: 1 },
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
          { material: "Backrest Structures", quantity: 1 },
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
          { material: "Seat Covers", quantity: 1 },
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
          { material: "Backrest Covers", quantity: 1 },
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

  // --- Locations & ProcessSteps ---
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
                      { material: "Seat Structures" },
                      { material: "Backrest Structures" },
                      { material: "Seat Foam" },
                      { material: "Headrest" },
                      { material: "Airbags" },
                      { material: "Small Parts" },
                    ]),
                },
              },
            },
          },
        ],
      },
    },
    include: {
      processSteps: true,
    },
  });

  const hall5 = await prisma.location.create({
    data: {
      name: "Hall 5 - Covers Receipt",
      processSteps: {
        create: [
          {
            name: "Covers Entry Point",
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
                      { material: "Seat Covers" },
                      { material: "Backrest Covers" },
                    ]),
                },
              },
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
          },
        ],
      },
    },
    include: {
      processSteps: true,
    },
  });

  const hall2 = await prisma.location.create({
    data: {
      name: "Hall 2 - Intermediate Storage (Supermarket)",
      processSteps: {
        create: [
          {
            name: "Storage Rack",
            inputSpeed: 5,
            outputSpeed: 5,
            status: "PROCEEDING",
            inventory: {
              create: {
                type: "processStep",
                limit: 500,
              },
            },
          },
          // ggf. weitere Steps auskommentiert
        ],
      },
    },
    include: {
      processSteps: true,
    },
  });

  const hall3 = await prisma.location.create({
    data: {
      name: "Hall 3 - Pre-Assembly and Upholstery",
      processSteps: {
        create: [
          {
            name: "Pre-Assembly - Seat",
            inputSpeed: 10,
            outputSpeed: 5,
            status: "PROCEEDING",
            recipe: { connect: { id: preAssemblyRecipeSeat.id } },
            inventory: { create: { type: "processStep", limit: 500 } },
          },
          {
            name: "Pre-Assembly - Backrest",
            inputSpeed: 5,
            outputSpeed: 5,
            status: "PROCEEDING",
            recipe: { connect: { id: preAssemblyRecipeBackrest.id } },
            inventory: { create: { type: "processStep", limit: 500 } },
          },
          {
            name: "Upholstery - Seat",
            inputSpeed: 5,
            outputSpeed: 5,
            status: "PROCEEDING",
            recipe: { connect: { id: upholsterySeatRecipe.id } },
            inventory: { create: { type: "processStep", limit: 500 } },
          },
          {
            name: "Upholstery - Backrest",
            inputSpeed: 5,
            outputSpeed: 5,
            status: "PROCEEDING",
            recipe: { connect: { id: upholsteryBackrestRecipe.id } },
            inventory: { create: { type: "processStep", limit: 500 } },
          },
        ],
      },
    },
    include: { processSteps: true },
  });

  const hall4 = await prisma.location.create({
    data: {
      name: "Hall 4 - Assembly and Quality Check",
      processSteps: {
        create: [
          {
            name: "Assembling",
            inputSpeed: 5,
            outputSpeed: 5,
            status: "PROCEEDING",
            inventory: { create: { type: "processStep", limit: 500 } },
            recipe: { connect: { id: assemblingRecipe.id } },
          },
          {
            name: "End of Line Check",
            inputSpeed: 5,
            outputSpeed: 5,
            status: "PROCEEDING",
            inventory: { create: { type: "processStep", limit: 500 } },
          },
        ],
      },
    },
    include: {
      processSteps: true,
    },
  });

  // --- Transport-Systeme erstellen ---
  //
  // ACHTUNG: Wir holen uns jeweils den ProcessStep, um an seine ID zu kommen
  // und rufen `createTransportSystemWithFilter(...)` auf.

  await createTransportSystemWithFilter(
    "Forklift - Hall 1 to Hall 2 (Seat Materials)",
    hall1.processSteps.find((ps) => ps.name === "Goods Entry Point")!.id,
    hall2.processSteps.find((ps) => ps.name === "Storage Rack")!.id
  );

  await createTransportSystemWithFilter(
    "Forklift - Hall 5 to Hall 2 (Covers)",
    hall5.processSteps.find((ps) => ps.name === "Covers Entry Point")!.id,
    hall2.processSteps.find((ps) => ps.name === "Storage Rack")!.id
  );

  await createTransportSystemWithFilter(
    "DTS - Hall 2 (Storage Rack) to Pre-Assembly (Seat)",
    hall2.processSteps.find((ps) => ps.name === "Storage Rack")!.id,
    hall3.processSteps.find((ps) => ps.name === "Pre-Assembly - Seat")!.id
  );

  await createTransportSystemWithFilter(
    "Roller - Hall 2 (Storage Rack) to Pre-Assembly (Backrest)",
    hall2.processSteps.find((ps) => ps.name === "Storage Rack")!.id,
    hall3.processSteps.find((ps) => ps.name === "Pre-Assembly - Backrest")!.id
  );

  await createTransportSystemWithFilter(
    "Roller - Pre-Assembly (Seat) to Upholstery (Seat)",
    hall3.processSteps.find((ps) => ps.name === "Pre-Assembly - Seat")!.id,
    hall3.processSteps.find((ps) => ps.name === "Upholstery - Seat")!.id
  );

  await createTransportSystemWithFilter(
    "Roller - Pre-Assembly (Backrest) to Upholstery (Backrest)",
    hall3.processSteps.find((ps) => ps.name === "Pre-Assembly - Backrest")!.id,
    hall3.processSteps.find((ps) => ps.name === "Upholstery - Backrest")!.id
  );

  await createTransportSystemWithFilter(
    "Roller - Storage Rack to Upholstery (Backrest)",
    hall2.processSteps.find((ps) => ps.name === "Storage Rack")!.id,
    hall3.processSteps.find((ps) => ps.name === "Upholstery - Backrest")!.id
  );

  await createTransportSystemWithFilter(
    "Roller - Storage Rack to Upholstery (Seat)",
    hall2.processSteps.find((ps) => ps.name === "Storage Rack")!.id,
    hall3.processSteps.find((ps) => ps.name === "Upholstery - Seat")!.id
  );

  await createTransportSystemWithFilter(
    "Conveyor - Upholstery (Seat) to Assembling",
    hall3.processSteps.find((ps) => ps.name === "Upholstery - Seat")!.id,
    hall4.processSteps.find((ps) => ps.name === "Assembling")!.id
  );

  await createTransportSystemWithFilter(
    "Conveyor - Upholstery (Backrest) to Assembling",
    hall3.processSteps.find((ps) => ps.name === "Upholstery - Backrest")!.id,
    hall4.processSteps.find((ps) => ps.name === "Assembling")!.id
  );

  await createTransportSystemWithFilter(
    "Conveyor - Assembling to End of Line Check",
    hall4.processSteps.find((ps) => ps.name === "Assembling")!.id,
    hall4.processSteps.find((ps) => ps.name === "End of Line Check")!.id,
    {
      overrideMaterials: ["Complete Seat"],
    }
  );

  await createTransportSystemWithFilter(
    "Forklift - Hall 4 (EOL) to Hall 5 (Shipping)",
    hall4.processSteps.find((ps) => ps.name === "End of Line Check")!.id,
    hall5.processSteps.find((ps) => ps.name === "Shipping")!.id
  );

  await createMockOrders(10);

  // Prüfe, was wir haben:
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
