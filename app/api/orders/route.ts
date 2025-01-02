import prisma from "@/data/db";

export async function GET() {
  const orders = await prisma.order.findMany();

  return Response.json(orders);
}
