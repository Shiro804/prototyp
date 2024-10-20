"use server";

import prisma from "@/data/db";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function create(machine: Prisma.MachineCreateInput) {
  await prisma.machine.create({
    data: machine,
  });

  revalidatePath("/");
  revalidatePath("/machines");
}

export async function del(id: number) {
  await prisma.machine.delete({
    where: {
      id: id,
    },
  });

  revalidatePath("/");
  revalidatePath("/machines");
}

export async function update(id: number, machine: Prisma.MachineUpdateInput) {
  await prisma.machine.update({
    where: {
      id,
    },
    data: machine,
  });

  revalidatePath("/machines");
}
