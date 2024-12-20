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
            name: "Incoming Commodities",
            inputSpeed: randomBetween(1, 3),
            outputSpeed: randomBetween(2, 5),
            status: "PROCEEDING",
            inventory: { create: { type: "processStep", limit: 500 } },
          },
        ],
      },
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
            inputSpeed: randomBetween(1, 3),
            outputSpeed: randomBetween(2, 5),
            status: "PROCEEDING",
            inventory: { create: { type: "processStep", limit: 500 } },
          },
        ],
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
            name: "Storage for Hall 1",
            inputSpeed: randomBetween(2, 4),
            outputSpeed: randomBetween(3, 6),
            status: "PROCEEDING",
            inventory: { create: { type: "processStep", limit: 500 } },
            inputs: {
              create: [
                {
                  name: "Transport from Hall 1",
                  inputSpeed: randomBetween(2, 4),
                  outputSpeed: randomBetween(3, 5),
                  inventory: {
                    create: { type: "transportSystem", limit: 500 },
                  },
                },
              ],
            },
          },
          {
            name: "Storage for Hall 5",
            inputSpeed: randomBetween(2, 4),
            outputSpeed: randomBetween(3, 6),
            status: "PROCEEDING",
            inventory: { create: { type: "processStep", limit: 500 } },
            inputs: {
              create: [
                {
                  name: "Transport from Hall 5",
                  inputSpeed: randomBetween(2, 4),
                  outputSpeed: randomBetween(3, 5),
                  inventory: {
                    create: { type: "transportSystem", limit: 500 },
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Hall 3
  const hall3 = await prisma.location.create({
    data: {
      name: "Hall 3",
      processSteps: {
        create: [
          {
            name: "Pre-Assembly",
            inputSpeed: randomBetween(3, 5),
            outputSpeed: randomBetween(4, 6),
            status: "PROCEEDING",
            inventory: { create: { type: "processStep", limit: 500 } },
            inputs: {
              create: [
                {
                  name: "Transport from Supermarket",
                  inputSpeed: randomBetween(3, 4),
                  outputSpeed: randomBetween(4, 6),
                  inventory: {
                    create: { type: "transportSystem", limit: 500 },
                  },
                },
              ],
            },
          },
        ],
      },
    },
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
            inputs: {
              create: [
                {
                  name: "Transport from Hall 3",
                  inputSpeed: randomBetween(3, 5),
                  outputSpeed: randomBetween(4, 6),
                  inventory: {
                    create: { type: "transportSystem", limit: 500 },
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Hall 5 (Outgoing Shipment)
  const hall5Shipping = await prisma.location.update({
    where: { id: hall5.id },
    data: {
      processSteps: {
        create: [
          {
            name: "Shipping",
            inputSpeed: randomBetween(3, 5),
            outputSpeed: randomBetween(4, 6),
            status: "PROCEEDING",
            inventory: { create: { type: "processStep", limit: 500 } },
            inputs: {
              create: [
                {
                  name: "Transport from Hall 4",
                  inputSpeed: randomBetween(3, 5),
                  outputSpeed: randomBetween(4, 6),
                  inventory: {
                    create: { type: "transportSystem", limit: 500 },
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log({ hall1, hall5, supermarket, hall3, hall4, hall5Shipping });
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
