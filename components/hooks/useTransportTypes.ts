// useTransportTypes.ts (new hook)
import { useEffect, useState } from "react";
import { SimulationRun } from "@/lib/simulation/Simulation";

export function useTransportTypes(simulation: SimulationRun) {
  const [allTypes, setAllTypes] = useState<string[]>([]);

  useEffect(() => {
    // Gather a superset of TS.type from ALL frames
    const typeSet = new Set<string>();

    simulation.frames.forEach((frame) => {
      frame.state.locations.forEach((loc) => {
        loc.processSteps.forEach((ps) => {
          ps.inputs.forEach((ts) => {
            if (ts.type) typeSet.add(ts.type);
          });
          ps.outputs.forEach((ts) => {
            if (ts.type) typeSet.add(ts.type);
          });
        });
      });
    });

    setAllTypes(Array.from(typeSet));
  }, [simulation]);

  return allTypes;
}
