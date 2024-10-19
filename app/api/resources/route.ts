import prisma from "@/data/db";

export async function GET() {
  const resources = await prisma.resource.findMany();

  return Response.json(resources);
}
