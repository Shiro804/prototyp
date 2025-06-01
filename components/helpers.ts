import prisma from "@/data/db";
import {
  ProcessStepFull,
  TransportSystemFull,
} from "@/lib/simulation/Simulation";
import { LocationFull } from "@/lib/simulation/Simulation";
import { InventoryEntry, Prisma, TransportSystem } from "@prisma/client";

/**
 * Helper functions for processing simulation data and inventory management.
 */

/**
 * Converts date strings ("YYYY-MM-DDTHH:mm:ss.sssZ") to actual Date objects.
 * @param key - The key of the object being processed
 * @param value - The value to check and potentially convert
 * @returns Date object if the value matches the date format, otherwise returns the original value
 */
export function convertDates(key: string, value: any) {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(value)) return value;
  return new Date(value);
}

/**
 * Retrieves all transport systems associated with a process step's outputs.
 * @param ps - The process step to analyze
 * @returns Array of transport systems connected to the process step
 */
export function getTransportSystemsForProcessStep(
  ps: ProcessStepFull
): TransportSystemFull[] {
  const tsList: TransportSystemFull[] = [];

  for (const ts of ps.outputs) {
    // ps.inputs.forEach((ts) => tsSet.set(ts.id, ts)); // (if relevant)
    tsList.push(ts);
  }

  return tsList;
}

/**
 * Gets all unique transport systems associated with a location's process steps.
 * @param location - The location to analyze
 * @returns Array of unique transport systems connected to the location
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
 * Retrieves all incoming commodity inventories for a location.
 * Only includes inputs that don't have a starting step (external inputs).
 * @param location - The location to analyze
 * @returns Array of inventory entry arrays for incoming commodities
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
 * Calculates the total number of commodity entries in a location's inventory.
 * @param location - The location to analyze
 * @returns Total count of inventory entries
 */
export function getTotalCommodities(location: LocationFull): number {
  return location.processSteps
    .flatMap((ps) => ps.inventory.entries)
    .reduce((acc, cur) => acc + 1, 0); // Total number of inventory entries
}

/**
 * Groups inventory entries by material type and counts occurrences.
 * Returns an alphabetically sorted object with material names as keys and counts as values.
 * @param inventories - Array of inventory objects to process
 * @returns Object with material counts, sorted alphabetically by material name
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
  // Sortieren der Gruppen nach Alphabet
  const sortedGrouped = Object.fromEntries(
    Object.entries(grouped).sort(([materialA], [materialB]) =>
      materialA.localeCompare(materialB)
    )
  );

  return sortedGrouped;
}
