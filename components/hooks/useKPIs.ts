// app/kpis/hooks/useKPIs.ts

import { useMemo } from "react";
import { Order, InventoryEntry, ProcessStep } from "@prisma/client";
import { LocationFull, SimulationRun } from "@/lib/simulation/Simulation";

// Define Interfaces for Enhanced Type Safety
interface Inventory {
  entries: InventoryEntry[];
  // Add other relevant properties if any
}

interface UseKPIsProps {
  simulation: SimulationRun;
  frame: number;
  speed: number;
}

interface KPIs {
  pendingCount: number;
  inProgressCount: number;
  completedCount: number;
  completedSeatsCount: number;
  averageTimeMinutes: number;
  completedSeatsPerMinute: number;
  averageOrdersPerMinute: number;
  openAssemblies: number;
  transportTypeDurations: Record<string, TransportTypeStats>;
}

interface TransportTypeStats {
  durations: number[];
  average: number;
}

// Method to check if all orders are completed
const areOrdersCompleteCheck = (orders: Order[]): boolean => {
  return orders.every((order) => order.status === "completed");
};

// app/kpis/hooks/useKPIs.ts

export const useKPIs = ({ simulation, frame, speed }: UseKPIsProps): KPIs => {
  // -----------------------------
  // 1) Basic KPI counts
  // -----------------------------
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

  // -----------------------------
  // 2) Compute completedSeatsCount with dynamic access
  // -----------------------------
  const completedSeatsCount = useMemo(() => {
    // Step 1: Find all process steps named "Shipping" across all locations
    const shippingProcessSteps = simulation.frames[
      frame
    ].state.locations.flatMap((loc) =>
      loc.processSteps.filter((ps) => ps.name === "Shipping")
    );

    // Step 2: Count "Complete Seat" materials in their inventories
    const completeSeatCount = shippingProcessSteps.reduce(
      (count: number, ps) => {
        if (ps.inventory && ps.inventory.entries) {
          return (
            count +
            ps.inventory.entries.filter((e) => e.material === "Complete Seat")
              .length
          );
        }
        return count;
      },
      0
    );

    return completeSeatCount;
  }, [simulation.frames, frame]);

  // -----------------------------
  // 3) Compute average processing time directly from completed orders
  // -----------------------------
  const averageTimeMinutes = useMemo(() => {
    const completedOrders = simulation.frames[frame].orders.filter(
      (o) =>
        o.status === "completed" &&
        o.startedTick != null &&
        o.completedTick != null
    );

    if (completedOrders.length === 0) return 0;

    const totalSeconds = completedOrders.reduce((acc, o) => {
      const durationTicks = o.completedTick! - o.startedTick!;
      return acc + durationTicks * speed;
    }, 0);

    return totalSeconds / 60 / completedOrders.length;
  }, [simulation.frames, frame, speed]);

  // -----------------------------
  // 4) Find the first frame where all orders are completed
  // -----------------------------
  const firstCompleteFrame = useMemo(() => {
    for (let i = 0; i <= frame; i++) {
      const currentOrders = simulation.frames[i].orders;
      if (areOrdersCompleteCheck(currentOrders)) {
        return i;
      }
    }
    return null;
  }, [simulation.frames, frame]);

  // -----------------------------
  // 5) Calculate Average Completed Seats per Minute (Refactored)
  // -----------------------------
  const completedSeatsPerMinute = useMemo(() => {
    if (firstCompleteFrame !== null) {
      const elapsedTimeMinutes = (firstCompleteFrame * speed) / 60;
      if (elapsedTimeMinutes > 0) {
        return completedSeatsCount / elapsedTimeMinutes;
      }
      return 0;
    } else {
      const elapsedTimeMinutes = (frame * speed) / 60;
      if (elapsedTimeMinutes > 0) {
        return completedSeatsCount / elapsedTimeMinutes;
      }
      return 0;
    }
  }, [completedSeatsCount, firstCompleteFrame, frame, speed]);

  // -----------------------------
  // 6) Calculate Average Completed Orders per Minute (Refactored)
  // -----------------------------
  const averageOrdersPerMinute = useMemo(() => {
    if (firstCompleteFrame !== null) {
      const elapsedTimeMinutes = (firstCompleteFrame * speed) / 60;
      if (elapsedTimeMinutes > 0) {
        return completedCount / elapsedTimeMinutes;
      }
      return 0;
    } else {
      const elapsedTimeMinutes = (frame * speed) / 60;
      if (elapsedTimeMinutes > 0) {
        return completedCount / elapsedTimeMinutes;
      }
      return 0;
    }
  }, [completedCount, firstCompleteFrame, frame, speed]);

  // -----------------------------
  // 7) Calculate Open Assemblies
  // -----------------------------
  const totalSeatsRequired = useMemo(() => {
    return simulation.frames[frame].orders.reduce(
      (acc: number, order) => acc + order.quantity,
      0
    );
  }, [simulation.frames, frame]);

  const transportTypeDurations = useMemo(() => {
    // Combine all durations from frames[0..frame]
    const aggregator: Record<string, number[]> = {};

    // Collect durations
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

    // Compute stats
    const results: Record<string, TransportTypeStats> = {};
    for (const [tsType, arr] of Object.entries(aggregator)) {
      const count = arr.length;
      if (count === 0) {
        results[tsType] = { durations: [], average: 0 };
      } else {
        const total = arr.reduce((acc, n) => acc + n, 0);
        const avg = total / count;
        results[tsType] = {
          durations: arr,
          average: avg,
        };
      }
    }
    return results;
  }, [simulation.frames, frame]);

  const openAssemblies = useMemo(() => {
    const open = totalSeatsRequired - completedSeatsCount;
    return open >= 0 ? open : 0;
  }, [totalSeatsRequired, completedSeatsCount]);

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
  };
};
