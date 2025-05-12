// simulationResourceManager.ts

import { SimulationEntityState } from "../Simulation";

export class SimulationResourceManager {
  public static applyResourceLogic(newState: SimulationEntityState): void {
    for (const loc of newState.locations) {
      for (const ps of loc.processSteps) {
        const prodResources = ps.resources.filter((r) => r.productionResource);
        const invResources = ps.resources.filter((r) => r.inventoryResource);

        const activeProd = prodResources.filter((r) => r.active && !r.faulty);
        const activeInv = invResources.filter((r) => r.active && !r.faulty);

        let prodMultiplier = 1;
        if (prodResources.length > 0) {
          const mandatoryProd = prodResources.filter((r) => r.mandatory);
          if (
            mandatoryProd.length === 1 &&
            (mandatoryProd[0].faulty || !mandatoryProd[0].active)
          ) {
            prodMultiplier = 0;
          } else {
            prodMultiplier = prodResources.length
              ? activeProd.length / prodResources.length
              : 1;
          }
        }

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

        (ps as any).__productionMultiplier = prodMultiplier;
        (ps as any).__inventoryMultiplier = invMultiplier;
      }

      for (const ps of loc.processSteps) {
        for (const ts of ps.inputs.concat(ps.outputs)) {
          const tsResources = ts.resources || [];
          const activeTSRes = tsResources.filter((r) => r.active && !r.faulty);

          let tsMultiplier = 1;
          if (tsResources.length > 0) {
            const mandatoryTS = tsResources.filter((r) => r.mandatory);
            if (
              mandatoryTS.length === 1 &&
              (mandatoryTS[0].faulty || !mandatoryTS[0].active)
            ) {
              tsMultiplier = 0;
            } else {
              tsMultiplier = tsResources.length
                ? activeTSRes.length / tsResources.length
                : 1;
            }
          }
          (ts as any).__inventoryMultiplier = tsMultiplier;
        }
      }
    }
  }
}
