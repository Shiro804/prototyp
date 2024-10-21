import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

function randomBetween(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

async function main() {
  for (let h = 0; h < 2; h++) {
    const stocks: Omit<Prisma.ProcessStepCreateInput, "location">[] = [];
    const stockCount = randomBetween(1, 4);
    const randomOffset = randomBetween(0, 1);

    for (let s = 0; s < (h == 0 ? 3 : stockCount); s++) {
      const materialArray =
        h == 0 ? ["Seat Structures", "Seat Foam", "Headrest"] : ["Seat Case"]; //Halle 1 hat Strukturen, Schäume und Kopfstützen
      stocks.push({
        name: "Lager " + (s + 1),
        inputSpeed: randomBetween(1, 4),
        outputSpeed: randomBetween(1, 4),
        status: "PROCEEDING",
        inventory: { create: { type: "processStep" } },
        inputs: {
          create: [
            {
              name: "Truck " + (s + 1),
              inputSpeed: randomBetween(1, 4),
              outputSpeed: randomBetween(1, 4),
              inventory: {
                create: {
                  type: "transportSystem",
                  entries: {
                    create: Array(randomBetween(1, 100)).fill({
                      material:
                        materialArray[
                          h == 0 ? s : 0 //randomBetween(0, materialArray.length - 1)
                        ],
                    }),
                  },
                },
              },
            },
          ],
        },
      });
    }

    const hall = await prisma.location.create({
      data: {
        name: "Halle " + (h + 1),
        processSteps: {
          create: stocks,
        },
      },
      include: {
        processSteps: {
          include: {
            inputs: true,
            outputs: true,
          },
        },
      },
    });

    console.log(hall);
  }
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
