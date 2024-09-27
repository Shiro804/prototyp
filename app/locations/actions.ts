"use server";

import prisma from "@/data/db";
import { Location } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function create(location: Location) {
  await prisma.location.create({
    data: location,
  });

  revalidatePath("/locations");
}

export async function del(location: Location) {
  await prisma.location.delete({
    where: {
      id: location.id,
    },
  });

  revalidatePath("/locations");
}
