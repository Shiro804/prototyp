"use server";

import prisma from "@/data/db";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function create(
  transportSystem: Prisma.TransportSystemCreateInput
) {
  await prisma.transportSystem.create({
    data: transportSystem,
  });

  revalidatePath("/");
  revalidatePath("/transport-systems");
}

export async function del(id: number) {
  await prisma.transportSystem.delete({
    where: {
      id: id,
    },
  });

  revalidatePath("/");
  revalidatePath("/transport-systems");
}

export async function update(
  id: number,
  transportSystem: Prisma.TransportSystemUpdateInput
) {
  await prisma.transportSystem.update({
    where: {
      id,
    },
    data: transportSystem,
  });

  revalidatePath("/transport-systems");
}
