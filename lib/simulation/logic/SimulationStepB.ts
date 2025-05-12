// logic/SimulationStepB.ts

import {
  SimulationEntityState,
  InventoryEntryWithDelay,
  ProcessStepFull,
} from "../Simulation";

interface ProcessStepProduction {
  affectedOrderIds: number[];
  finishTick: number;
  itemsProducedPerRun: number;
  rawItems?: InventoryEntryWithDelay[];
  recipeOutputs: { material: string; quantity: number }[];
}

export class SimulationStepB {
  // The verbatim logic for (B) NO-RECIPE STEPS, extracted:
  public static handleNoRecipeSteps(
    newState: SimulationEntityState,
    currentTick: number,
    psDurationMap: Record<string, number[]>,
    finalizeNoRecipe: (
      ps: ProcessStepFull,
      production: ProcessStepProduction
    ) => void
  ) {
    for (const location of newState.locations) {
      for (const ps of location.processSteps) {
        if (!ps.active || ps.recipe) continue;

        const ephemeralProd = (ps as any)
          .__ongoingProduction as ProcessStepProduction[];

        if (ephemeralProd.length > 0) {
          const currentProd = ephemeralProd[0];
          if (currentTick >= currentProd.finishTick) {
            finalizeNoRecipe(ps, currentProd);
            ephemeralProd.shift();
          }
        }

        if (ephemeralProd.length === 0) {
          const rawItems = [...ps.inventory.entries];
          if (rawItems.length > 0) {
            const finishTick = currentTick + (ps.duration || 1);
            ephemeralProd.push({
              finishTick,
              affectedOrderIds: [],
              itemsProducedPerRun: 0,
              rawItems,
              recipeOutputs: [],
            });
          }
        }
      }
    }
  }
}
