"use server";

import prisma from "@/data/db";
import { Prisma, Location } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function create(location: Prisma.LocationCreateInput) {
  await prisma.location.create({
    data: location,
  });

  revalidatePath("/locations");
}

export async function del(id: number) {
  await prisma.location.delete({
    where: {
      id: id,
    },
  });

  revalidatePath("/locations");
}

export async function update(id: number, location: Prisma.LocationUpdateInput) {
  await prisma.location.update({
    where: {
      id,
    },
    data: location,
  });

  revalidatePath("/locations");
}
