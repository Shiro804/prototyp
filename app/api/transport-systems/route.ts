import prisma from "@/data/db";

export async function GET() {
  const transportSystems = await prisma.transportSystem.findMany({
    include: {
      inventory: { include: { entries: true } },
      filter: { include: { entries: true } },
      orders: true,
      sensors: {
        include: {
          logEntries: true,
        },
      },
    },
  });

  return Response.json(transportSystems);
}
