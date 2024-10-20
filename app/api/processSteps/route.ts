import prisma from "@/data/db";

export async function GET() {
  const processStep = await prisma.processStep.findMany();

  return Response.json(processStep);
}
