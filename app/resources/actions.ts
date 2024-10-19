"use server";

import prisma from "@/data/db";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function create(resource: Prisma.ResourceCreateInput) {
  await prisma.resource.create({
    data: resource,
  });

  revalidatePath("/");
  revalidatePath("/resources");
}

export async function del(id: number) {
  await prisma.resource.delete({
    where: {
      id: id,
    },
  });

  revalidatePath("/");
  revalidatePath("/resources");
}

export async function update(id: number, resource: Prisma.ResourceUpdateInput) {
  await prisma.resource.update({
    where: {
      id,
    },
    data: resource,
  });

  revalidatePath("/resources");
}
