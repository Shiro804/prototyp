import prisma from "@/data/db";

export async function GET() {
  const locations = await prisma.location.findMany();

  return Response.json(locations);
}
