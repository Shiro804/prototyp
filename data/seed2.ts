import ProcessSteps from "@/app/process-steps/page";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  // Hall 1
  const hall1 = await prisma.location.create({
    data: {
      name: "Hall 1",
      processSteps: {
        create: [
          {
            name: "Rack 1",
            inputSpeed: randomBetween(1, 3),
            outputSpeed: randomBetween(2, 5),
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

  // Supermarket (Hall 2)
  const supermarket = await prisma.location.create({
    data: {
      name: "Supermarket",
      processSteps: {
        create: [
          {
            name: "Input Router 1",
            inputSpeed: randomBetween(2, 4),
            outputSpeed: randomBetween(3, 6),
            status: "PROCEEDING",
            inventory: { create: { type: "processStep", limit: 500 } },
          },
          {
            name: "Rack 2",
            inputSpeed: randomBetween(2, 4),
            outputSpeed: randomBetween(3, 6),
            status: "PROCEEDING",
            inventory: { create: { type: "processStep", limit: 500 } },
          },
          {
            name: "Rack 3",
            inputSpeed: randomBetween(2, 4),
            outputSpeed: randomBetween(3, 6),
            status: "PROCEEDING",
            inventory: { create: { type: "processStep", limit: 500 } },
          },
          {
            name: "Rack 4",
            inputSpeed: randomBetween(2, 4),
            outputSpeed: randomBetween(3, 6),
            status: "PROCEEDING",
            inventory: { create: { type: "processStep", limit: 500 } },
          },
          {
            name: "Rack 5",
            inputSpeed: randomBetween(2, 4),
            outputSpeed: randomBetween(3, 6),
            status: "PROCEEDING",
            inventory: { create: { type: "processStep", limit: 500 } },
          },
          {
            name: "Output Router 1",
            inputSpeed: randomBetween(2, 4),
            outputSpeed: randomBetween(3, 6),
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

  let createTransportSystem = (
    name: string,
    from: { id: number },
    to: { id: number },
  ) =>
    prisma.transportSystem.create({
      data: {
        name,
        inputSpeed: randomBetween(2, 4),
        outputSpeed: randomBetween(3, 6),
        inventory: { create: { type: "transportSystem", limit: 500 } },
        startStep: { connect: { id: from.id } },
        endStep: { connect: { id: to.id } },
      },
    });

  await createTransportSystem(
    "Forklift 1",
    hall1.processSteps.find((ps) => ps.name === "Rack 1")!,
    supermarket.processSteps.find((ps) => ps.name === "Input Router 1")!,
  );

  await createTransportSystem(
    "Trolley 1",
    supermarket.processSteps.find((ps) => ps.name === "Input Router 1")!,
    supermarket.processSteps.find((ps) => ps.name === "Rack 2")!,
  );

  await createTransportSystem(
    "Trolley 2",
    supermarket.processSteps.find((ps) => ps.name === "Input Router 1")!,
    supermarket.processSteps.find((ps) => ps.name === "Rack 3")!,
  );

  await createTransportSystem(
    "Trolley 3",
    supermarket.processSteps.find((ps) => ps.name === "Input Router 1")!,
    supermarket.processSteps.find((ps) => ps.name === "Rack 4")!,
  );

  await createTransportSystem(
    "Trolley 4",
    supermarket.processSteps.find((ps) => ps.name === "Input Router 1")!,
    supermarket.processSteps.find((ps) => ps.name === "Rack 5")!,
  );

  await createTransportSystem(
    "Trolley 5",
    supermarket.processSteps.find((ps) => ps.name === "Rack 2")!,
    supermarket.processSteps.find((ps) => ps.name === "Output Router 1")!,
  );

  await createTransportSystem(
    "Trolley 6",
    supermarket.processSteps.find((ps) => ps.name === "Rack 3")!,
    supermarket.processSteps.find((ps) => ps.name === "Output Router 1")!,
  );

  await createTransportSystem(
    "Trolley 7",
    supermarket.processSteps.find((ps) => ps.name === "Rack 4")!,
    supermarket.processSteps.find((ps) => ps.name === "Output Router 1")!,
  );

  await createTransportSystem(
    "Trolley 8",
    supermarket.processSteps.find((ps) => ps.name === "Rack 5")!,
    supermarket.processSteps.find((ps) => ps.name === "Output Router 1")!,
  );

  // Hall 3
  const hall3 = await prisma.location.create({
    data: {
      name: "Hall 3",
      processSteps: {
        create: [
          {
            name: "Unpacking 1",
            inputSpeed: randomBetween(3, 5),
            outputSpeed: randomBetween(4, 6),
            status: "PROCEEDING",
            inventory: { create: { type: "processStep", limit: 500 } },
          },
          {
            name: "Workbenching 1",
            inputSpeed: randomBetween(3, 5),
            outputSpeed: randomBetween(4, 6),
            status: "PROCEEDING",
            inventory: { create: { type: "processStep", limit: 500 } },
          },
          {
            name: "Assembling 1",
            inputSpeed: randomBetween(3, 5),
            outputSpeed: randomBetween(4, 6),
            status: "PROCEEDING",
            inventory: { create: { type: "processStep", limit: 500 } },
          },
        ],
      },
    },
    include: { processSteps: true },
  });

  await prisma.resource.create({
    data: {
      name: "Unpacking Machine 1",
      location: { connect: { id: hall3.id } },
      active: true,
      // Resource is of type machine:
      Machine: {
        create: {},
      },
      processStep: {
        connect: {
          id: hall3.processSteps.find((ps) => ps.name === "Unpacking 1")!.id,
        },
      },
    },
  });

  await createTransportSystem(
    "Trolley 9",
    supermarket.processSteps.find((ps) => ps.name === "Output Router 1")!,
    hall3.processSteps.find((ps) => ps.name === "Unpacking 1")!,
  );

  await createTransportSystem(
    "Trolley 10",
    hall3.processSteps.find((ps) => ps.name === "Unpacking 1")!,
    hall3.processSteps.find((ps) => ps.name === "Workbenching 1")!,
  );

  await createTransportSystem(
    "Trolley 11",
    hall3.processSteps.find((ps) => ps.name === "Workbenching 1")!,
    hall3.processSteps.find((ps) => ps.name === "Assembling 1")!,
  );

  // Hall 5
  // const hall5 = await prisma.location.create({
  //   data: {
  //     name: "Hall 5",
  //     processSteps: {
  //       create: [
  //         {
  //           name: "Incoming Crates",
  //           inputSpeed: randomBetween(1, 3),
  //           outputSpeed: randomBetween(2, 5),
  //           status: "PROCEEDING",
  //           inventory: { create: { type: "processStep", limit: 500 } },
  //         },
  //       ],
  //     },
  //   },
  // });

  // Hall 4
  // const hall4 = await prisma.location.create({
  //   data: {
  //     name: "Hall 4",
  //     processSteps: {
  //       create: [
  //         {
  //           name: "Quality Check",
  //           inputSpeed: randomBetween(3, 5),
  //           outputSpeed: randomBetween(4, 6),
  //           status: "PROCEEDING",
  //           inventory: { create: { type: "processStep", limit: 500 } },
  //           inputs: {
  //             create: [
  //               {
  //                 name: "Transport from Hall 3",
  //                 inputSpeed: randomBetween(3, 5),
  //                 outputSpeed: randomBetween(4, 6),
  //                 inventory: {
  //                   create: { type: "transportSystem", limit: 500 },
  //                 },
  //               },
  //             ],
  //           },
  //         },
  //       ],
  //     },
  //   },
  // });

  // Hall 5 (Outgoing Shipment)
  // const hall5Shipping = await prisma.location.update({
  //   where: { id: hall5.id },
  //   data: {
  //     processSteps: {
  //       create: [
  //         {
  //           name: "Shipping",
  //           inputSpeed: randomBetween(3, 5),
  //           outputSpeed: randomBetween(4, 6),
  //           status: "PROCEEDING",
  //           inventory: { create: { type: "processStep", limit: 500 } },
  //           inputs: {
  //             create: [
  //               {
  //                 name: "Transport from Hall 4",
  //                 inputSpeed: randomBetween(3, 5),
  //                 outputSpeed: randomBetween(4, 6),
  //                 inventory: {
  //                   create: { type: "transportSystem", limit: 500 },
  //                 },
  //               },
  //             ],
  //           },
  //         },
  //       ],
  //     },
  //   },
  // });

  console.dir(
    {
      locations: await prisma.location.findMany({
        include: { processSteps: true, resources: true },
      }),
      transportSystems: await prisma.transportSystem.findMany(),
    },
    { depth: 10 },
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
