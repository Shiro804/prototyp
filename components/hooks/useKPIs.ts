// app/kpis/hooks/useKPIs.ts

import { useMemo } from "react";
import { Order, InventoryEntry, ProcessStep } from "@prisma/client";
import {
  LocationFull,
  SimulationRun,
  SimulationFrame,
} from "@/lib/simulation/Simulation";

// Our external KPI interface
export interface KPIs {
  pendingCount: number;
  inProgressCount: number;
  completedCount: number;
  completedSeatsCount: number;
  averageTimeMinutes: number;
  completedSeatsPerMinute: number;
  averageOrdersPerMinute: number;
  openAssemblies: number;
  transportTypeDurations: Record<string, TransportTypeStats>;
  numberOfProcessSteps: number;
  processStepNames: Map<number, string>;
  transportSystemCounts: Record<string, number>;
  totalTransportSystems: number;
  processStepDurationsAverages: Record<
    string,
    { durations: number[]; average: number }
  >;
}

interface UseKPIsProps {
  simulation: SimulationRun;
  frame: number;
  speed: number;
}

interface TransportTypeStats {
  durations: number[];
  average: number;
}

const areOrdersCompleteCheck = (orders: Order[]): boolean => {
  return orders.every((order) => order.status === "completed");
};

export const useKPIs = ({ simulation, frame, speed }: UseKPIsProps): KPIs => {
  // Basic KPI counts
  const pendingCount = useMemo(
    () =>
      simulation.frames[frame].orders.filter((o) => o.status === "pending")
        .length,
    [simulation.frames, frame]
  );
  const inProgressCount = useMemo(
    () =>
      simulation.frames[frame].orders.filter((o) => o.status === "in_progress")
        .length,
    [simulation.frames, frame]
  );
  const completedCount = useMemo(
    () =>
      simulation.frames[frame].orders.filter((o) => o.status === "completed")
        .length,
    [simulation.frames, frame]
  );

  // Completed Seats
  const completedSeatsCount = useMemo(() => {
    const shippingSteps = simulation.frames[frame].state.locations.flatMap(
      (loc) => loc.processSteps.filter((ps) => ps.name === "Shipping")
    );
    let total = 0;
    for (const step of shippingSteps) {
      total += step.inventory.entries.filter(
        (e) => e.material === "Complete Seat"
      ).length;
    }
    return total;
  }, [simulation.frames, frame]);

  // Average Time
  const averageTimeMinutes = useMemo(() => {
    const doneOrders = simulation.frames[frame].orders.filter(
      (o) =>
        o.status === "completed" &&
        o.startedTick != null &&
        o.completedTick != null
    );
    if (doneOrders.length === 0) return 0;
    const totalSeconds = doneOrders.reduce((acc, o) => {
      const ticks = o.completedTick! - o.startedTick!;
      return acc + ticks * speed;
    }, 0);
    return totalSeconds / 60 / doneOrders.length;
  }, [simulation.frames, frame, speed]);

  // firstCompleteFrame
  const firstCompleteFrame = useMemo(() => {
    for (let i = 0; i <= frame; i++) {
      const allDone = areOrdersCompleteCheck(simulation.frames[i].orders);
      if (allDone) return i;
    }
    return null;
  }, [simulation.frames, frame]);

  // Completed Seats / min
  const completedSeatsPerMinute = useMemo(() => {
    if (firstCompleteFrame !== null) {
      const mins = (firstCompleteFrame * speed) / 60;
      return mins > 0 ? completedSeatsCount / mins : 0;
    } else {
      const mins = (frame * speed) / 60;
      return mins > 0 ? completedSeatsCount / mins : 0;
    }
  }, [completedSeatsCount, firstCompleteFrame, frame, speed]);

  // Orders completed / min
  const averageOrdersPerMinute = useMemo(() => {
    if (firstCompleteFrame !== null) {
      const mins = (firstCompleteFrame * speed) / 60;
      return mins > 0 ? completedCount / mins : 0;
    } else {
      const mins = (frame * speed) / 60;
      return mins > 0 ? completedCount / mins : 0;
    }
  }, [completedCount, firstCompleteFrame, frame, speed]);

  // Open Assemblies
  const totalSeatsRequired = useMemo(() => {
    return simulation.frames[frame].orders.reduce(
      (acc, order) => acc + order.quantity,
      0
    );
  }, [simulation.frames, frame]);

  const openAssemblies = useMemo(() => {
    const open = totalSeatsRequired - completedSeatsCount;
    return open >= 0 ? open : 0;
  }, [totalSeatsRequired, completedSeatsCount]);

  // Combine TS durations
  const transportTypeDurations = useMemo(() => {
    const aggregator: Record<string, number[]> = {};
    for (let i = 0; i <= frame; i++) {
      const fr = simulation.frames[i];
      if (fr.tsTypeDurations) {
        for (const [tsType, durationsArr] of Object.entries(
          fr.tsTypeDurations
        )) {
          aggregator[tsType] = aggregator[tsType] || [];
          aggregator[tsType].push(...durationsArr);
        }
      }
    }
    const results: Record<string, TransportTypeStats> = {};
    for (const [tsType, arr] of Object.entries(aggregator)) {
      const count = arr.length;
      if (count === 0) {
        results[tsType] = { durations: [], average: 0 };
      } else {
        const total = arr.reduce((acc, n) => acc + n, 0);
        results[tsType] = {
          durations: arr,
          average: total / count,
        };
      }
    }
    return results;
  }, [simulation.frames, frame]);

  // Combine Process Step durations
  // We'll store them in a map: { psId -> all durations }, then compute average
  const processStepDurationsAverages = useMemo(() => {
    const aggregator: Record<string, number[]> = {};
    for (let i = 0; i <= frame; i++) {
      const fr = simulation.frames[i];
      if (fr.processStepDurations) {
        for (const [psName, durationsArr] of Object.entries(
          fr.processStepDurations
        )) {
          aggregator[psName] = aggregator[psName] || [];
          aggregator[psName].push(...durationsArr);
        }
      }
    }
    const result: Record<string, { durations: number[]; average: number }> = {};
    for (const [psName, arr] of Object.entries(aggregator)) {
      if (arr.length === 0) {
        result[psName] = { durations: [], average: 0 };
      } else {
        const total = arr.reduce((acc, n) => acc + n, 0);
        const avg = total / arr.length;
        result[psName] = { durations: arr, average: avg / 60 };
      }
    }
    return result;
  }, [simulation.frames, frame]);

  // numberOfProcessSteps + processStepNames
  const { numberOfProcessSteps, processStepNames } = useMemo(() => {
    let countPS = 0;
    let names: Map<number, string> = new Map();
    const fr = simulation.frames[frame];
    for (const loc of fr.state.locations) {
      for (const ps of loc.processSteps) {
        countPS++;
        names.set(ps.id, ps.name);
      }
    }
    return {
      numberOfProcessSteps: countPS,
      processStepNames: names,
    };
  }, [simulation.frames, frame]);

  // TS counts
  const { transportSystemCounts, totalTransportSystems } = useMemo(() => {
    const aggregator: Record<string, Set<number>> = {};
    const fr = simulation.frames[frame];
    for (const loc of fr.state.locations) {
      for (const ps of loc.processSteps) {
        for (const inp of ps.inputs) {
          const typeName = inp.type || "Unknown";
          aggregator[typeName] = aggregator[typeName] || new Set();
          aggregator[typeName].add(inp.id);
        }
        for (const out of ps.outputs) {
          const typeName = out.type || "Unknown";
          aggregator[typeName] = aggregator[typeName] || new Set();
          aggregator[typeName].add(out.id);
        }
      }
    }
    let totalCount = 0;
    for (const setOfIds of Object.values(aggregator)) {
      totalCount += setOfIds.size;
    }
    const finalCounts: Record<string, number> = {};
    for (const [typeName, ids] of Object.entries(aggregator)) {
      finalCounts[typeName] = ids.size;
    }
    return {
      transportSystemCounts: finalCounts,
      totalTransportSystems: totalCount,
    };
  }, [simulation.frames, frame]);

  return {
    pendingCount,
    inProgressCount,
    completedCount,
    completedSeatsCount,
    averageTimeMinutes,
    completedSeatsPerMinute,
    averageOrdersPerMinute,
    openAssemblies,

    transportTypeDurations,
    numberOfProcessSteps,
    processStepNames,
    transportSystemCounts,
    totalTransportSystems,
    processStepDurationsAverages,
  };
};
