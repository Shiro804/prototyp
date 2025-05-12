// simulationProductionManager.ts

import { nextFreeInventoryEntryId } from "../inventories";
import {
  ProcessStepFull,
  TransportSystemFull,
  SimulationEntityState,
  InventoryEntryWithDelay,
} from "../Simulation";

interface ProcessStepProduction {
  affectedOrderIds: number[];
  finishTick: number;
  itemsProducedPerRun: number;
  rawItems?: InventoryEntryWithDelay[];
  recipeOutputs: { material: string; quantity: number }[];
}

export class SimulationProductionManager {
  public static checkResourceFaulty(
    res: ProcessStepFull | TransportSystemFull
  ): boolean {
    // Placeholder
    return true;
  }

  public static productionSucceeds(ps: ProcessStepFull): boolean {
    if (!ps.errorRate) return true;
    return Math.random() > ps.errorRate;
  }

  public static finalizeProductionRun(
    ps: ProcessStepFull,
    newState: SimulationEntityState,
    production: ProcessStepProduction,
    movedOrderIds: Set<number>,
    sensorLogger: (
      psOrTS: ProcessStepFull | TransportSystemFull,
      logType: "input" | "output" | "product",
      items: InventoryEntryWithDelay[]
    ) => boolean
  ): void {
    for (const oid of production.affectedOrderIds) {
      for (const out of production.recipeOutputs) {
        for (let i = 0; i < out.quantity; i++) {
          const newEntry = {
            id: nextFreeInventoryEntryId(newState),
            addedAt: new Date(),
            inventoryId: ps.inventory.id,
            material: out.material,
            orderId: oid,
            slotNumber: undefined,
          } as InventoryEntryWithDelay;

          ps.inventory.entries.push(newEntry);
          // you'd call Simulation.assignSlots(...) again

          sensorLogger(ps, "product", [newEntry]);
        }
      }
      movedOrderIds.add(oid);
    }

    console.log(
      `ProcessStep "${ps.name}" completed a production run (duration=${ps.duration}). Produced: ${production.itemsProducedPerRun} item(s) for Orders: ${production.affectedOrderIds}`
    );
  }

  public static finalizeNoRecipe(
    ps: ProcessStepFull,
    production: ProcessStepProduction,
    psDurationMap: Record<string, number[]>
  ): void {
    const totalWait = ps.duration || 1;
    const itemCount = production.rawItems?.length || 0;
    if (!psDurationMap[ps.name]) {
      psDurationMap[ps.name] = [];
    }
    for (let i = 0; i < itemCount; i++) {
      psDurationMap[ps.name].push(totalWait);
    }

    console.log(
      `ProcessStep "${ps.name}" (no-recipe) waited duration=${ps.duration}. Items: ${itemCount}`
    );
  }
}
