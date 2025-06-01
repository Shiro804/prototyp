import {
  ProcessStepFull,
  TransportSystemFull,
} from "@/lib/simulation/Simulation";
import { LocationFull } from "@/lib/simulation/Simulation";
import { InventoryEntry } from "@prisma/client";

/**
 * Converts date strings ("YYYY-MM-DDTHH:mm:ss.sssZ") to actual Date objects.
 * Used for JSON parsing with date conversion via JSON.parse(str, convertDates)
 */
export function convertDates(key: string, value: any) {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(value)) return value;
  return new Date(value);
}

/**
 * Extracts all transport systems connected as outputs from a process step
 */
export function getTransportSystemsForProcessStep(
  ps: ProcessStepFull
): TransportSystemFull[] {
  const tsList: TransportSystemFull[] = [];
  for (const ts of ps.outputs) {
    // ps.inputs.forEach((ts) => tsSet.map(ts.id, ts)); // (if relevant)
    tsList.push(ts);
  }
  return tsList;
}

/**
 * Aggregates all unique transport systems from all process steps within a location
 * Uses Map to deduplicate transport systems by ID
 */
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

/**
 * Finds external incoming commodities for a location
 * Filters for transport systems without a start step (external inputs)
 */
export function getIncomingCommodities(
  location: LocationFull
): InventoryEntry[][] {
  return location.processSteps.flatMap((ps) =>
    ps.inputs
      .filter((input) => input.startStepId === null)
      .map((i) => i.inventory.entries)
  );
}

/**
 * Counts total number of inventory entries across all process steps in a location
 */
export function getTotalCommodities(location: LocationFull): number {
  return location.processSteps
    .flatMap((ps) => ps.inventory.entries)
    .reduce((acc, cur) => acc + 1, 0);
}

/**
 * Groups inventory entries by material type and counts occurrences
 * Returns alphabetically sorted material groups
 */
export function groupInventory(
  inventories: { entries: { material: string }[] }[]
): { [material: string]: number } {
  const grouped: { [material: string]: number } = {};
  for (const inventory of inventories) {
    for (const entry of inventory.entries) {
      grouped[entry.material] = (grouped[entry.material] || 0) + 1;
    }
  }
  // Sort groups alphabetically
  const sortedGrouped = Object.fromEntries(
    Object.entries(grouped).sort(([materialA], [materialB]) =>
      materialA.localeCompare(materialB)
    )
  );
  return sortedGrouped;
}
