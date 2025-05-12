// simulationUtils.ts

import { InventoryEntryWithDelay, SimulationEntityState } from "../Simulation";
import { convertDates } from "@/components/helpers";
import { Order } from "@prisma/client";

export class SimulationUtils {
  public static objectsToReferences(state: SimulationEntityState): void {
    // your same code
  }

  public static cloneState(
    state: SimulationEntityState
  ): SimulationEntityState {
    return JSON.parse(JSON.stringify(state), convertDates);
  }

  public static cloneOrders(
    orders: (Order & { materialsReserved?: boolean })[]
  ): Order[] {
    return orders.map((o) => ({ ...o }));
  }

  public static findNextFreeSlot(
    inventory: any,
    entries: InventoryEntryWithDelay[]
  ) {
    // ...
  }
}
