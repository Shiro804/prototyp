import prisma from "@/data/db";
import { TransportSystemFull } from "@/lib/simulation/Simulation";
import { LocationFull } from "@/lib/simulation/simulationNew";
import { InventoryEntry, Prisma, TransportSystem } from "@prisma/client";

export function getTransportSystemsForLocation(
  location: LocationFull
): TransportSystemFull[] {
  const tsSet = new Map<number, TransportSystemFull>();

  for (const ps of location.processSteps) {
    // ps.inputs.forEach((ts) => tsSet.set(ts.id, ts)); // (if relevant)
    ps.outputs.forEach((ts) => tsSet.set(ts.id, ts));
  }

  return Array.from(tsSet.values());
}

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
  // Sortieren der Gruppen nach Alphabet
  const sortedGrouped = Object.fromEntries(
    Object.entries(grouped).sort(([materialA], [materialB]) =>
      materialA.localeCompare(materialB)
    )
  );

  return sortedGrouped;
}
