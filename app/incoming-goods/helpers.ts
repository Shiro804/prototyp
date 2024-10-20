import { LocationFull } from "@/lib/simulation/simulation";
import { Inventory, Prisma } from "@prisma/client";

export function getIncomingCommodities(location: LocationFull): number {
  return location.processSteps
    .flatMap((ps) => ps.inputs)
    .filter((i) => i.startStepId === null)
    .map((i) => i.inventory.entries.length)
    .map((i) => (console.log(i), i))
    .reduce((acc, cur) => acc + cur, 0);
}

/**
 * Calculates the total number of commodities in the location.
 * @param location Location to calculate the total commodities of.
 * @returns The number of commodities across all process steps.
 */
export function getTotalCommodities(location: LocationFull): number {
  return location.processSteps
    .map((ps) => ps.inventory.entries.length)
    .reduce((acc, cur) => acc + cur, 0);
}

export type InventoryGroups = {
  [material: string]: number;
};

export function groupInventory(
  inventory: Prisma.InventoryGetPayload<{ include: { entries: true } }>
): InventoryGroups {
  return inventory.entries.reduce<InventoryGroups>((acc, cur) => {
    if (!acc[cur.material]) {
      acc[cur.material] = 1;
    } else {
      acc[cur.material] += 1;
    }

    return acc;
  }, {});
}
