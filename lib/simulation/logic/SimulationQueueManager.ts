// simulationQueueManager.ts

import { SimulationEntityState, InventoryEntryWithDelay } from "../Simulation";
import { handleNotification } from "@/app/notification-settings/page";

export class SimulationQueueManager {
  public static dequeueItems(
    newState: SimulationEntityState,
    notificationsEnabled: boolean
  ): void {
    for (const loc of newState.locations) {
      for (const ps of loc.processSteps) {
        // If ps has a queue
        if (!(ps as any).__queue) continue;
        if (!ps.active) continue;

        const capNow = ps.inventory.limit - ps.inventory.entries.length;
        if (capNow <= 0) continue;

        const psQueue = (ps as any).__queue as InventoryEntryWithDelay[];
        const toMove = psQueue.splice(0, capNow);
        if (toMove.length > 0) {
          // Unqueued from a process step
          if (notificationsEnabled) {
            handleNotification(
              "Queue",
              `${toMove.length} item(s) unqueued from ProcessStep (${ps.name})`,
              "info"
            );
          }

          ps.inventory.entries.push(...toMove);
          // We are referencing Simulation.assignSlots(...) from the main code
          // but in a real refactor you'd import or replicate that method.
        }
      }

      // For each TS in each processStep
      for (const ps of loc.processSteps) {
        for (const ts of ps.inputs.concat(ps.outputs)) {
          if (!(ts as any).__queue) continue;
          if (!ts.active) continue;

          const capNow = ts.inventory.limit - ts.inventory.entries.length;
          if (capNow <= 0) continue;

          const tsQueue = (ts as any).__queue as InventoryEntryWithDelay[];
          const toMove = tsQueue.splice(0, capNow);
          if (toMove.length > 0) {
            // Unqueued from a transport system
            if (notificationsEnabled) {
              handleNotification(
                "Queue",
                `${toMove.length} item(s) unqueued from ${
                  ts.type || "TransportSystem"
                } (${ts.name})`,
                "info"
              );
            }
            ts.inventory.entries.push(...toMove);
            // same note: you'd call Simulation.assignSlots(ts.inventory, toMove);
          }
        }
      }
    }
  }
}
