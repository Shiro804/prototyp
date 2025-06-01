// simulationResourceManager.ts

import { SimulationEntityState } from "../Simulation";

/**
 * Manages resource calculations and multipliers for simulation entities
 */
export class SimulationResourceManager {
  /**
   * Calculates and applies resource multipliers to process steps and their inputs/outputs
   * based on the active status and faults of associated resources
   * @param newState Current simulation entity state to process
   */
  public static applyResourceLogic(newState: SimulationEntityState): void {
    for (const loc of newState.locations) {
      for (const ps of loc.processSteps) {
        // Separate resources into production and inventory types
        const prodResources = ps.resources.filter((r) => r.productionResource);
        const invResources = ps.resources.filter((r) => r.inventoryResource);

        // Get count of active and non-faulty resources
        const activeProd = prodResources.filter((r) => r.active && !r.faulty);
        const activeInv = invResources.filter((r) => r.active && !r.faulty);

        // Calculate production multiplier
        let prodMultiplier = 1;
        if (prodResources.length > 0) {
          // Check if mandatory production resource is inactive/faulty
          const mandatoryProd = prodResources.filter((r) => r.mandatory);
          if (
            mandatoryProd.length === 1 &&
            (mandatoryProd[0].faulty || !mandatoryProd[0].active)
          ) {
            prodMultiplier = 0; // Stop production if mandatory resource is unavailable
          } else {
            // Calculate ratio of active production resources
            prodMultiplier = prodResources.length
              ? activeProd.length / prodResources.length
              : 1;
          }
        }

        // Calculate inventory multiplier (similar logic to production)
        let invMultiplier = 1;
        if (invResources.length > 0) {
          const mandatoryInv = invResources.filter((r) => r.mandatory);
          if (
            mandatoryInv.length === 1 &&
            (mandatoryInv[0].faulty || !mandatoryInv[0].active)
          ) {
            invMultiplier = 0;
          } else {
            invMultiplier = invResources.length
              ? activeInv.length / invResources.length
              : 1;
          }
        }

        // Store calculated multipliers on process step
        (ps as any).__productionMultiplier = prodMultiplier;
        (ps as any).__inventoryMultiplier = invMultiplier;
      }

      // Process transport steps (inputs and outputs) for each process step
      for (const ps of loc.processSteps) {
        for (const ts of ps.inputs.concat(ps.outputs)) {
          // Calculate transport step multiplier
          const tsResources = ts.resources || [];
          const activeTSRes = tsResources.filter((r) => r.active && !r.faulty);

          let tsMultiplier = 1;
          if (tsResources.length > 0) {
            const mandatoryTS = tsResources.filter((r) => r.mandatory);
            if (
              mandatoryTS.length === 1 &&
              (mandatoryTS[0].faulty || !mandatoryTS[0].active)
            ) {
              tsMultiplier = 0; // Stop transport if mandatory resource is unavailable
            } else {
              tsMultiplier = tsResources.length
                ? activeTSRes.length / tsResources.length
                : 1;
            }
          }
          // Store calculated multiplier on transport step
          (ts as any).__inventoryMultiplier = tsMultiplier;
        }
      }
    }
  }
}
