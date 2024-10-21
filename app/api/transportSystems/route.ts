import prisma from "@/data/db";

export async function GET() {
  const transportSystems = await prisma.transportSystem.findMany();

  return Response.json(transportSystems);
}
