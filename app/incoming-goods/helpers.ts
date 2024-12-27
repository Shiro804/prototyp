import prisma from "@/data/db";
import { LocationFull } from "@/lib/simulation/simulationNew";
import { InventoryEntry, Prisma } from "@prisma/client";

export function getIncomingCommodities(
  location: LocationFull
): InventoryEntry[][] {
  return location.processSteps.flatMap((ps) =>
    ps.inputs
      .filter((input) => input.startStepId === null)
      .map((i) => i.inventory.entries)
  );
}

export function getTotalCommodities(location: LocationFull): number {
  return location.processSteps
    .flatMap((ps) => ps.inventory.entries)
    .reduce((acc, cur) => acc + 1, 0); // Total number of inventory entries
}

export function groupInventory(
  inventories: { entries: { material: string }[] }[]
): { [material: string]: number } {
  const grouped: { [material: string]: number } = {};

  for (const inventory of inventories) {
    for (const entry of inventory.entries) {
      grouped[entry.material] = (grouped[entry.material] || 0) + 1;
    }
  }

  return grouped;
}

