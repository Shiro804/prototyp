// logic/SimulationStepA.ts

import { SimulationEntityState, InventoryEntryWithDelay, ProcessStepFull } from "../Simulation";
import { InventoryEntry } from "@prisma/client";

interface ProcessStepProduction {
  affectedOrderIds: number[];
  finishTick: number;
  itemsProducedPerRun: number;
  rawItems?: InventoryEntryWithDelay[];
  recipeOutputs: { material: string; quantity: number }[];
}

export class SimulationStepA {
  // The verbatim logic for (A) RECIPE STEPS, extracted:
  public static handleRecipeSteps(
    newState: SimulationEntityState,
    currentTick: number,
    movedOrderIds: Set<number>,
    activeOrderIds: Set<number>,
    psDurationMap: Record<string, number[]>,
    checkResourceFaulty: (ps: ProcessStepFull) => boolean,
    productionSucceeds: (ps: ProcessStepFull) => boolean,
    finalizeProductionRun: (
      ps: ProcessStepFull,
      production: ProcessStepProduction
    ) => void
  ) {
    for (const location of newState.locations) {
      for (const ps of location.processSteps) {
        if (!ps.active || !ps.recipe) continue;

        const ephemeralProd = (ps as any)
          .__ongoingProduction as ProcessStepProduction[];

        // finalize if done
        if (ephemeralProd.length > 0) {
          const currentProd = ephemeralProd[0];
          if (currentTick >= currentProd.finishTick) {
            finalizeProductionRun(ps, currentProd);
            ephemeralProd.shift();
          }
        }

        // start new
        if (ephemeralProd.length === 0) {
          const itemsConsumedPerRun = ps.recipe.inputs
            .map((o) => o.quantity)
            .reduce((acc, cur) => acc + cur, 0);
          const itemsProducedPerRun = ps.recipe.outputs
            .map((o) => o.quantity)
            .reduce((acc, cur) => acc + cur, 0);

          const effectiveRecipeRate = Math.floor(
            ps.recipeRate * ((ps as any).__productionMultiplier || 0)
          );

          for (
            let r = 0;
            r < effectiveRecipeRate &&
            ps.inventory.entries.length +
              (itemsProducedPerRun - itemsConsumedPerRun) <=
              ps.inventory.limit;
            r++
          ) {
            let inputsFulfilled = true;
            const inputEntries: InventoryEntry[] = [];

            for (const recipeInput of ps.recipe.inputs) {
              const possible: InventoryEntry[] = [];
              for (const entry of ps.inventory.entries) {
                if (
                  recipeInput.material === entry.material &&
                  entry.orderId &&
                  activeOrderIds.has(entry.orderId)
                ) {
                  possible.push(entry);
                }
                if (possible.length >= recipeInput.quantity) break;
              }
              if (possible.length >= recipeInput.quantity) {
                inputEntries.push(...possible);
              } else {
                inputsFulfilled = false;
                break;
              }
            }

            if (inputsFulfilled) {
              if (!checkResourceFaulty(ps)) {
                continue;
              }
              if (!productionSucceeds(ps)) {
                // skip
              } else {
                const transformStart = Math.min(
                  ...inputEntries.map(
                    (xx) =>
                      (xx as InventoryEntryWithDelay).arrivedTick ?? currentTick
                  )
                );
                const transformationDuration = currentTick - transformStart;

                if (!psDurationMap[ps.name]) {
                  psDurationMap[ps.name] = [];
                }
                psDurationMap[ps.name].push(
                  Math.max(0, transformationDuration)
                );

                // remove inputs
                const inputSet = new Set(inputEntries);
                const toRemove = ps.inventory.entries.filter((e) =>
                  inputSet.has(e)
                );
                // We'll rely on Simulation.freeSlots outside
                ps.inventory.entries = ps.inventory.entries.filter(
                  (e) => !inputSet.has(e)
                );

                const finishTick = currentTick + (ps.duration || 1);
                ephemeralProd.push({
                  finishTick,
                  affectedOrderIds: Array.from(
                    new Set(inputEntries.map((e) => e.orderId))
                  ).filter((x): x is number => x != null),
                  itemsProducedPerRun,
                  recipeOutputs: ps.recipe.outputs.map((o) => ({
                    material: o.material,
                    quantity: o.quantity,
                  })),
                });
              }
            }
          }
        }
      }
    }
  }
}
