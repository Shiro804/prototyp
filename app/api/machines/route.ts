import prisma from "@/data/db";

export async function GET() {
  const machines = await prisma.machine.findMany();

  return Response.json(machines);
}
