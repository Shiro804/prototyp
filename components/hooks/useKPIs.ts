// app/kpis/hooks/useKPIs.ts

import { useMemo } from "react";
import { Order, InventoryEntry, ProcessStep } from "@prisma/client";
import {
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
  simulation?: SimulationRun; // Made simulation optional
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
      simulation
        ? simulation.frames[frame].orders.filter((o) => o.status === "pending")
            .length
        : 0,
    [simulation, frame]
  );

  const inProgressCount = useMemo(
    () =>
      simulation
        ? simulation.frames[frame].orders.filter((o) => o.status === "in_progress")
            .length
        : 0,
    [simulation, frame]
  );

  const completedCount = useMemo(
    () =>
      simulation
        ? simulation.frames[frame].orders.filter((o) => o.status === "completed")
            .length
        : 0,
    [simulation, frame]
  );

  // Completed Seats
  const completedSeatsCount = useMemo(() => {
    if (!simulation) return 0;
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
  }, [simulation, frame]);

  // Average Time
  const averageTimeMinutes = useMemo(() => {
    if (!simulation) return 0;
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
  }, [simulation, frame, speed]);

  // firstCompleteFrame
  const firstCompleteFrame = useMemo(() => {
    if (!simulation) return null;
    for (let i = 0; i <= frame; i++) {
      const allDone = areOrdersCompleteCheck(simulation.frames[i].orders);
      if (allDone) return i;
    }
    return null;
  }, [simulation, frame]);

  // Completed Seats / min
  const completedSeatsPerMinute = useMemo(() => {
    if (!simulation) return 0;
    if (firstCompleteFrame !== null) {
      const mins = (firstCompleteFrame * speed) / 60;
      return mins > 0 ? completedSeatsCount / mins : 0;
    } else {
      const mins = (frame * speed) / 60;
      return mins > 0 ? completedSeatsCount / mins : 0;
    }
  }, [completedSeatsCount, firstCompleteFrame, frame, speed, simulation]);

  // Orders completed / min
  const averageOrdersPerMinute = useMemo(() => {
    if (!simulation) return 0;
    if (firstCompleteFrame !== null) {
      const mins = (firstCompleteFrame * speed) / 60;
      return mins > 0 ? completedCount / mins : 0;
    } else {
      const mins = (frame * speed) / 60;
      return mins > 0 ? completedCount / mins : 0;
    }
  }, [completedCount, firstCompleteFrame, frame, speed, simulation]);

  // Open Assemblies
  const totalSeatsRequired = useMemo(() => {
    if (!simulation) return 0;
    return simulation.frames[frame].orders.reduce(
      (acc, order) => acc + order.quantity,
      0
    );
  }, [simulation, frame]);

  const openAssemblies = useMemo(() => {
    if (!simulation) return 0;
    const open = totalSeatsRequired - completedSeatsCount;
    return open >= 0 ? open : 0;
  }, [totalSeatsRequired, completedSeatsCount, simulation]);

  // Combine TS durations
  const transportTypeDurations = useMemo(() => {
    if (!simulation) return {};
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
  }, [simulation, frame]);

  // Combine Process Step durations
  const processStepDurationsAverages = useMemo(() => {
    if (!simulation) return {};
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
  }, [simulation, frame]);

  // numberOfProcessSteps + processStepNames
  const { numberOfProcessSteps, processStepNames } = useMemo(() => {
    if (!simulation) return { numberOfProcessSteps: 0, processStepNames: new Map() };
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
  }, [simulation, frame]);

  // TS counts
  const { transportSystemCounts, totalTransportSystems } = useMemo(() => {
    if (!simulation) return { transportSystemCounts: {}, totalTransportSystems: 0 };
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
  }, [simulation, frame]);

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
