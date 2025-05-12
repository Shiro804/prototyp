// simulationQueueManager.ts

import { SimulationEntityState, InventoryEntryWithDelay } from "../Simulation";
import { handleNotification } from "@/app/notification-settings/page";

export class SimulationQueueManager {
  /**
   * Dequeues items from process steps and transport systems if there is capacity.
   * If items are actually dequeued, we record a bottleneck event in `newState.bottlenecks`.
   */
  public static dequeueItems(
    newState: SimulationEntityState,
    notificationsEnabled: boolean,
    currentTick: number
  ): void {
    // If for some reason bottlenecks is missing, ensure it exists
    // (In practice, the Simulation constructor or reset method might do this)
    if (!newState.bottlenecks) {
      newState.bottlenecks = [];
    }

    for (const loc of newState.locations) {
      // 1) Dequeue from ProcessSteps
      for (const ps of loc.processSteps) {
        // If ps has a queue
        if (!(ps as any).__queue) continue;
        if (!ps.active) continue;

        const capNow = ps.inventory.limit - ps.inventory.entries.length;
        if (capNow <= 0) continue;

        const psQueue = (ps as any).__queue as InventoryEntryWithDelay[];
        const toMove = psQueue.splice(0, capNow);
        if (toMove.length > 0) {
          // Record a bottleneck event
          newState.bottlenecks.push({
            tick: currentTick,
            name: ps.name,
          });

          if (notificationsEnabled) {
            handleNotification(
              "Queue",
              `${toMove.length} item(s) unqueued from ProcessStep (${ps.name})`,
              "info"
            );
          }

          // Actually dequeue them
          ps.inventory.entries.push(...toMove);
          // In a real refactor you'd call Simulation.assignSlots(ps.inventory, toMove);
        }
      }

      // 2) Dequeue from TransportSystems (ps.inputs + ps.outputs)
      for (const ps of loc.processSteps) {
        for (const ts of ps.inputs.concat(ps.outputs)) {
          if (!(ts as any).__queue) continue;
          if (!ts.active) continue;

          const capNow = ts.inventory.limit - ts.inventory.entries.length;
          if (capNow <= 0) continue;

          const tsQueue = (ts as any).__queue as InventoryEntryWithDelay[];
          const toMove = tsQueue.splice(0, capNow);
          if (toMove.length > 0) {
            // Record a bottleneck event
            newState.bottlenecks.push({
              tick: currentTick,
              name: ts.name,
            });

            if (notificationsEnabled) {
              handleNotification(
                "Queue",
                `${toMove.length} item(s) unqueued from ${
                  ts.type || "TransportSystem"
                } (${ts.name})`,
                "info"
              );
            }

            // Actually dequeue them
            ts.inventory.entries.push(...toMove);
            // In a real refactor you'd call Simulation.assignSlots(ts.inventory, toMove);
          }
        }
      }
    }
  }
}
