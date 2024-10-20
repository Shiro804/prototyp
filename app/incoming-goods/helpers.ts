import { LocationFull } from "@/lib/simulation/simulation";

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
