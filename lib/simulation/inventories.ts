import { SimulationEntityState } from "./Simulation";

export function nextFreeInventoryEntryId(state: SimulationEntityState): number {
  return (
    Math.max(
      ...state.locations
        .flatMap((l) => l.processSteps)
        .flatMap((ps) =>
          ps.inputs
            .map((i) => i.inventory.entries)
            .concat(ps.outputs.map((o) => o.inventory.entries))
            .concat([ps.inventory.entries])
        )
        .flat()
        .flatMap((e) => e.id)
    ) + 1
  );
}
