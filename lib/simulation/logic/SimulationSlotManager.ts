// simulationSlotManager.ts

import { InventoryEntryWithDelay } from "../Simulation";

export class SimulationSlotManager {
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

  public static assignSlots(
    inventory: any,
    entries: InventoryEntryWithDelay[]
  ) {
    if (!inventory.usedSlots) {
      inventory.usedSlots = [];
    }
    for (const item of entries) {
      let slotFound: number | null = null;
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
        item.slotNumber = slotFound;
        inventory.usedSlots.push(slotFound);
      }
    }
  }

  public static freeSlots(inventory: any, entries: InventoryEntryWithDelay[]) {
    if (!inventory.usedSlots) {
      inventory.usedSlots = [];
    }
    for (const item of entries) {
      if (item.slotNumber != null) {
        inventory.usedSlots = inventory.usedSlots.filter(
          (s: number) => s !== item.slotNumber
        );
        item.slotNumber = undefined;
      }
    }
  }
}
