// simulationSlotManager.ts

import { InventoryEntryWithDelay } from "../Simulation";

/**
 * Manages slot assignments for inventory items in a simulation.
 * Handles the allocation and deallocation of slot numbers for inventory entries.
 */
export class SimulationSlotManager {
  /**
   * Ensures that the inventory has a valid usedSlots array by initializing it if needed.
   * Scans through existing entries and records their slot numbers.
   * @param inv The inventory object to process
   */
  public static ensureUsedSlotsForInventory(inv: any): void {
    if (!inv.usedSlots) {
      inv.usedSlots = [];
      for (const e of inv.entries) {
        if (e.slotNumber != null && !inv.usedSlots.includes(e.slotNumber)) {
          inv.usedSlots.push(e.slotNumber);
        }
      }
    }
  }

  /**
   * Assigns available slot numbers to new inventory entries.
   * Searches for the first available slot number and assigns it to each entry.
   * @param inventory The inventory object containing slot information and limits
   * @param entries Array of inventory entries that need slot assignments
   */
  public static assignSlots(
    inventory: any,
    entries: InventoryEntryWithDelay[]
  ) {
    if (!inventory.usedSlots) {
      inventory.usedSlots = [];
    }
    for (const item of entries) {
      let slotFound: number | null = null;
      // Search for the first available slot number
      for (let i = 0; i < inventory.limit; i++) {
        if (!inventory.usedSlots.includes(i)) {
          slotFound = i;
          break;
        }
      }
      if (slotFound == null) {
        console.warn(
          `Kein freier Stellplatz (Slot) mehr in Inventory ${inventory.id}.`
        );
      } else {
        // Assign the found slot to the item and mark it as used
        item.slotNumber = slotFound;
        inventory.usedSlots.push(slotFound);
      }
    }
  }

  /**
   * Frees up slots by removing slot assignments from specified entries.
   * Removes the slot numbers from the usedSlots array and clears the slot number from entries.
   * @param inventory The inventory object containing the usedSlots array
   * @param entries Array of inventory entries whose slots should be freed
   */
  public static freeSlots(inventory: any, entries: InventoryEntryWithDelay[]) {
    if (!inventory.usedSlots) {
      inventory.usedSlots = [];
    }
    for (const item of entries) {
      if (item.slotNumber != null) {
        // Remove the slot number from usedSlots and clear it from the item
        inventory.usedSlots = inventory.usedSlots.filter(
          (s: number) => s !== item.slotNumber
        );
        item.slotNumber = undefined;
      }
    }
  }
}
