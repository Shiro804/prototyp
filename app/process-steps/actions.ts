"use server";

import prisma from "@/data/db";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function create(processStep: Prisma.ProcessStepCreateInput) {
  await prisma.processStep.create({
    data: processStep,
  });

  revalidatePath("/");
  revalidatePath("/process-steps");
}

export async function del(id: number) {
  await prisma.processStep.delete({
    where: {
      id: id,
    },
  });

  revalidatePath("/");
  revalidatePath("/process-steps");
}

export async function update(id: number, processStep: Prisma.ProcessStepUpdateInput) {
  await prisma.processStep.update({
    where: {
      id,
    },
    data: processStep,
  });

  revalidatePath("/process-steps");
}
