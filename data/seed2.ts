import ProcessSteps from "@/app/process-steps/page";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  // Updated Hall 1 Mock Data
  const hall1 = await prisma.location.create({
    data: {
      name: "Hall 1",
      processSteps: {
        create: [
          {
            name: "Rack 1",
            inputSpeed: randomBetween(1, 3),
            outputSpeed: randomBetween(2, 5), // Increased for flow
            status: "PROCEEDING",
            inventory: {
              create: {
                type: "processStep",
                limit: 1000, // Increased for 100 seats
                entries: {
                  create: Array(10)
                    .fill(0)
                    .flatMap(() => [
                      { material: "Seat Structures" },
                      { material: "Seat Foam" },
                      { material: "Headrest" },
                    ]),
                },
              },
            },
          },
        ],
      },
    },
    include: {
      processSteps: {
        include: {
          inventory: {
            include: {
              entries: true,
            },
          },
        },
      },
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
    to: { id: number }
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
    supermarket.processSteps.find((ps) => ps.name === "Input Router 1")!
  );

  await createTransportSystem(
    "Trolley 1",
    supermarket.processSteps.find((ps) => ps.name === "Input Router 1")!,
    supermarket.processSteps.find((ps) => ps.name === "Rack 2")!
  );

  await createTransportSystem(
    "Trolley 5",
    supermarket.processSteps.find((ps) => ps.name === "Rack 2")!,
    supermarket.processSteps.find((ps) => ps.name === "Output Router 1")!
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

  // Hall 4
  const hall4 = await prisma.location.create({
    data: {
      name: "Hall 4",
      processSteps: {
        create: [
          {
            name: "Quality Check",
            inputSpeed: randomBetween(3, 5),
            outputSpeed: randomBetween(4, 6),
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

  // Hall 5
  const hall5 = await prisma.location.create({
    data: {
      name: "Hall 5",
      processSteps: {
        create: [
          {
            name: "Incoming Crates",
            inputSpeed: randomBetween(3, 5),
            outputSpeed: randomBetween(4, 6),
            status: "PROCEEDING",
            inventory: {
              create: {
                type: "processStep",
                limit: 500,
                entries: {
                  create: [
                    { material: "Seat Cases" },
                    { material: "Metal Frames" },
                  ],
                },
              },
            },
          },
          {
            name: "Shipping",
            inputSpeed: randomBetween(3, 5),
            outputSpeed: randomBetween(4, 6),
            status: "PROCEEDING",
            inventory: { create: { type: "processStep", limit: 500 } },
          },
        ],
      },
    },
    include: {
      processSteps: {
        include: {
          inventory: {
            include: {
              entries: true,
            },
          },
        },
      },
    },
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
    hall3.processSteps.find((ps) => ps.name === "Unpacking 1")!
  );

  await createTransportSystem(
    "Trolley 10",
    hall3.processSteps.find((ps) => ps.name === "Unpacking 1")!,
    hall3.processSteps.find((ps) => ps.name === "Workbenching 1")!
  );

  await createTransportSystem(
    "Trolley 11",
    hall3.processSteps.find((ps) => ps.name === "Workbenching 1")!,
    hall3.processSteps.find((ps) => ps.name === "Assembling 1")!
  );

  // Transport System from Hall 3 to Hall 4
  await createTransportSystem(
    "Trolley 12",
    hall3.processSteps.find((ps) => ps.name === "Assembling 1")!,
    hall4.processSteps.find((ps) => ps.name === "Quality Check")!
  );

  // Transport System from Hall 4 to Hall 5
  await createTransportSystem(
    "Trolley 13",
    hall4.processSteps.find((ps) => ps.name === "Quality Check")!,
    hall5.processSteps.find((ps) => ps.name === "Shipping")!
  );

  console.dir(
    {
      locations: await prisma.location.findMany({
        include: { processSteps: true, resources: true },
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
