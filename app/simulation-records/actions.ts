"use server";

import prisma from "@/data/db";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function create(
  SimulationRecord: Prisma.SimulationRecordCreateInput
) {
  await prisma.simulationRecord.create({
    data: SimulationRecord,
  });

  revalidatePath("/");
  revalidatePath("/simulations");
}

export async function del(id: number) {
  await prisma.simulationRecord.delete({
    where: {
      id: id,
    },
  });

  revalidatePath("/");
  revalidatePath("/simulations");
}

export async function update(
  id: number,
  SimulationRecord: Prisma.SimulationRecordUpdateInput
) {
  await prisma.simulationRecord.update({
    where: {
      id,
    },
    data: SimulationRecord,
  });

  revalidatePath("/simulations");
}
