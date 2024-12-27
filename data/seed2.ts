import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  // Create Recipes
  const supermarketDTSSeatRecipe = await prisma.recipe.create({
    data: {
      name: "Supermarket DTS Seat Recipe",
      inputs: {
        create: [
          { material: "Seat Foam", quantity: 1 },
          { material: "Seat Structures", quantity: 1 },
          { material: "Airbags", quantity: 1 },
          { material: "Small Parts", quantity: 1 },
          { material: "Seat Covers", quantity: 1 },
        ],
      },
      outputs: {
        create: [
          { material: "Seat Foam", quantity: 1 },
          { material: "Seat Structures", quantity: 1 },
          { material: "Airbags", quantity: 1 },
          { material: "Small Parts", quantity: 1 },
          { material: "Seat Covers", quantity: 1 },
        ],
      },
    },
  });

  const supermarketDTSBackrestRecipe = await prisma.recipe.create({
    data: {
      name: "Supermarket DTS Backrest Recipe",
      inputs: {
        create: [
          { material: "Headrest", quantity: 1 },
          { material: "Backrest Structures", quantity: 1 },
          { material: "Backrest Covers", quantity: 1 },
        ],
      },
      outputs: {
        create: [
          { material: "Headrest", quantity: 1 },
          { material: "Backrest Structures", quantity: 1 },
          { material: "Backrest Covers", quantity: 1 },
        ],
      },
    },
  });

  const preAssemblyRecipeSeat = await prisma.recipe.create({
    data: {
      name: "Pre-Assembly - Seat Recipe",
      inputs: {
        create: [
          { material: "Seat Foam", quantity: 1 },
          { material: "Seat Structures", quantity: 1 },
          { material: "Airbags", quantity: 1 },
          { material: "Small Parts", quantity: 1 },
          { material: "Seat Covers", quantity: 1 },
        ],
      },
      outputs: {
        create: [
          { material: "Pre-Assembled Seat", quantity: 1 },
          { material: "Seat Covers", quantity: 1 },
        ],
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
          { material: "Backrest Covers", quantity: 1 },
        ],
      },
      outputs: {
        create: [
          { material: "Pre-Assembled Backrest", quantity: 1 },
          { material: "Backrest Covers", quantity: 1 },
        ],
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

  // const assemblyLineRecipe = await prisma.recipe.create({
  //   data: {
  //     name: "Assembly Line Recipe",
  //     // inputs: {
  //     //   create: [
  //     //     { material: "Upholstered Seat", quantity: 1 },
  //     //     { material: "Upholstered Backrest", quantity: 1 },
  //     //   ],
  //     // },
  //     outputs: {
  //       create: [
  //         { material: "Upholstered Seat", quantity: 1 },
  //         { material: "Upholstered Backrest", quantity: 1 },
  //       ],
  //     },
  //   },
  // });

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

  const eolRecipe = await prisma.recipe.create({
    data: {
      name: "EOL Recipe",
      inputs: {
        create: [{ material: "Complete Seat", quantity: 1 }],
      },
      outputs: {
        create: [{ material: "Complete Seat", quantity: 1 }],
      },
    },
  });

  const shippingRecipe = await prisma.recipe.create({
    data: {
      name: "Shipping Recipe",
      inputs: {
        create: [{ material: "Complete Seat", quantity: 1 }],
      },
      outputs: {
        create: [{ material: "Complete Seat", quantity: 1 }],
      },
    },
  });

  // Hall 1 - Goods Receipt
  const hall1 = await prisma.location.create({
    data: {
      name: "Hall 1 - Goods Receipt",
      processSteps: {
        create: [
          {
            name: "Goods Entry Point",
            inputSpeed: 100,
            outputSpeed: 100,
            status: "PROCEEDING",
            inventory: {
              create: {
                type: "processStep",
                limit: 1000,
                entries: {
                  create: Array(100)
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

  // Hall 5 - Covers Receipt
  const hall5 = await prisma.location.create({
    data: {
      name: "Hall 5 - Covers Receipt",
      processSteps: {
        create: [
          {
            name: "Covers Entry Point",
            inputSpeed: 100,
            outputSpeed: 100,
            status: "PROCEEDING",
            inventory: {
              create: {
                type: "processStep",
                limit: 500,
                entries: {
                  create: Array(100)
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
            inputSpeed: 100,
            outputSpeed: 100,
            status: "PROCEEDING",
            inventory: {
              create: {
                type: "processStep",
                limit: 500,
              },
            },
            recipe: { connect: { id: shippingRecipe.id } },
          },
        ],
      },
    },
    include: {
      processSteps: true,
    },
  });

  // Supermarket (Hall 2 - Intermediate Storage)
  const hall2 = await prisma.location.create({
    data: {
      name: "Hall 2 - Intermediate Storage (Supermarket)",
      processSteps: {
        create: [
          {
            name: "Storage Rack",
            inputSpeed: 100,
            outputSpeed: 100,
            status: "PROCEEDING",
            inventory: { create: { type: "processStep", limit: 500 } },
          },
          {
            name: "Supermarket DTS Seat",
            inputSpeed: 100,
            outputSpeed: 100,
            status: "PROCEEDING",
            inventory: { create: { type: "processStep", limit: 500 } },
            recipe: { connect: { id: supermarketDTSSeatRecipe.id } },
          },
          {
            name: "Supermarket DTS Backrest",
            inputSpeed: 100,
            outputSpeed: 100,
            status: "PROCEEDING",
            inventory: { create: { type: "processStep", limit: 500 } },
            recipe: { connect: { id: supermarketDTSBackrestRecipe.id } },
          },
        ],
      },
    },
    include: {
      processSteps: true,
    },
  });

  // Hall 3 - Pre-Assembly and Upholstery
  const hall3 = await prisma.location.create({
    data: {
      name: "Hall 3 - Pre-Assembly and Upholstery",
      processSteps: {
        create: [
          {
            name: "Pre-Assembly - Seat",
            inputSpeed: 100,
            outputSpeed: 100,
            status: "PROCEEDING",
            recipe: { connect: { id: preAssemblyRecipeSeat.id } },
            inventory: { create: { type: "processStep", limit: 500 } },
          },
          {
            name: "Pre-Assembly - Backrest",
            inputSpeed: 100,
            outputSpeed: 100,
            status: "PROCEEDING",
            recipe: { connect: { id: preAssemblyRecipeBackrest.id } },
            inventory: { create: { type: "processStep", limit: 500 } },
          },
          {
            name: "Upholstery - Seat",
            inputSpeed: 100,
            outputSpeed: 100,
            status: "PROCEEDING",
            recipe: { connect: { id: upholsterySeatRecipe.id } },
            inventory: { create: { type: "processStep", limit: 500 } },
          },
          {
            name: "Upholstery - Backrest",
            inputSpeed: 100,
            outputSpeed: 100,
            status: "PROCEEDING",
            recipe: { connect: { id: upholsteryBackrestRecipe.id } },
            inventory: { create: { type: "processStep", limit: 500 } },
          },
        ],
      },
    },
    include: { processSteps: true },
  });

  // Hall 4 - Assembly and Quality Check
  const hall4 = await prisma.location.create({
    data: {
      name: "Hall 4 - Assembly and Quality Check",
      processSteps: {
        create: [
          // {
          //   name: "Assembly Line",
          //   inputSpeed: 100,
          //   outputSpeed: 100,
          //   status: "PROCEEDING",
          //   inventory: { create: { type: "processStep", limit: 500 } },
          //   recipe: { connect: { id: assemblyLineRecipe.id } },
          // },
          {
            name: "Assembling",
            inputSpeed: 100,
            outputSpeed: 100,
            status: "PROCEEDING",
            inventory: { create: { type: "processStep", limit: 500 } },
            recipe: { connect: { id: assemblingRecipe.id } },
          },
          {
            name: "End of Line Check",
            inputSpeed: 100,
            outputSpeed: 100,
            status: "PROCEEDING",
            inventory: { create: { type: "processStep", limit: 500 } },
            recipe: { connect: { id: eolRecipe.id } },
          },
        ],
      },
    },
    include: {
      processSteps: true,
    },
  });

  // Transport System Creation Function
  let createTransportSystem = async (
    name: string,
    from: { id: number },
    to: { id: number }
  ) =>
    prisma.transportSystem.create({
      data: {
        name,
        inputSpeed: 100,
        outputSpeed: 100,
        inventory: { create: { type: "transportSystem", limit: 1000 } },
        startStep: { connect: { id: from.id } },
        endStep: { connect: { id: to.id } },
      },
    });

  // Creating Transport Systems
  await createTransportSystem(
    "Forklift - Hall 1 to Hall 2 (Seat Materials)",
    hall1.processSteps.find((ps) => ps.name === "Goods Entry Point")!,
    hall2.processSteps.find((ps) => ps.name === "Storage Rack")!
  );

  await createTransportSystem(
    "Forklift - Hall 5 to Hall 2 (Covers)",
    hall5.processSteps.find((ps) => ps.name === "Covers Entry Point")!,
    hall2.processSteps.find((ps) => ps.name === "Storage Rack")!
  );

  await createTransportSystem(
    "Worker puts Materials for Seat Pre-Assembly on DTS",
    hall2.processSteps.find((ps) => ps.name === "Storage Rack")!,
    hall2.processSteps.find((ps) => ps.name === "Supermarket DTS Seat")!
  );

  await createTransportSystem(
    "Worker puts Materials for Backrest Pre-Assembly on DTS",
    hall2.processSteps.find((ps) => ps.name === "Storage Rack")!,
    hall2.processSteps.find((ps) => ps.name === "Supermarket DTS Backrest")!
  );

  await createTransportSystem(
    "DTS Seat for Pre-Assembly",
    hall2.processSteps.find((ps) => ps.name === "Supermarket DTS Seat")!,
    hall3.processSteps.find((ps) => ps.name === "Pre-Assembly - Seat")!
  );

  await createTransportSystem(
    "Roller - Rack 1 to Pre-Assembly (Backrest)",
    hall2.processSteps.find((ps) => ps.name === "Supermarket DTS Backrest")!,
    hall3.processSteps.find((ps) => ps.name === "Pre-Assembly - Backrest")!
  );

  await createTransportSystem(
    "Roller - Pre-Assembly (Seat) to Upholstery Seeat",
    hall3.processSteps.find((ps) => ps.name === "Pre-Assembly - Seat")!,
    hall3.processSteps.find((ps) => ps.name === "Upholstery - Seat")!
  );

  await createTransportSystem(
    "Roller - Rack 2 to Upholstery (Backrest Covers)",
    hall3.processSteps.find((ps) => ps.name === "Pre-Assembly - Backrest")!,
    hall3.processSteps.find((ps) => ps.name === "Upholstery - Backrest")!
  );

  await createTransportSystem(
    "Conveyor - Upholstery (Seat) to Assembly",
    hall3.processSteps.find((ps) => ps.name === "Upholstery - Seat")!,
    hall4.processSteps.find((ps) => ps.name === "Assembling")!
  );

  await createTransportSystem(
    "Conveyor - Upholstered Backrest to Assembly Line",
    hall3.processSteps.find((ps) => ps.name === "Upholstery - Backrest")!,
    hall4.processSteps.find((ps) => ps.name === "Assembling")!
  );

  await createTransportSystem(
    "Conveyor - Assembling to End of Line Check",
    hall4.processSteps.find((ps) => ps.name === "Assembling")!,
    hall4.processSteps.find((ps) => ps.name === "End of Line Check")!
  );

  // From End of Line Check to Shipping
  await createTransportSystem(
    "Forklift - Hall 4 to Hall 5",
    hall4.processSteps.find((ps) => ps.name === "End of Line Check")!,
    hall5.processSteps.find((ps) => ps.name === "Shipping")!
  );

  console.dir(
    {
      locations: await prisma.location.findMany({
        include: { processSteps: true },
      }),
      transportSystems: await prisma.transportSystem.findMany(),
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
