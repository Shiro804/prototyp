// logic/SimulationStepC.ts

import { SimulationEntityState, InventoryEntryWithDelay } from "../Simulation";
import { distributeRoundRobin } from "../round-robin";
import { InventoryEntry } from "@prisma/client";

export class SimulationStepC {
  /**
   * (C) OUTLET: Move items from a ProcessStep (PS) to its TransportSystems (TS),
   * distributing them. If the TS is full or inactive, we push them to the TS's queue
   * and record a bottleneck event in newState.bottlenecks.
   */
  public static handleOutlet(
    newState: SimulationEntityState,
    currentTick: number,
    notificationsEnabled: boolean,
    movedOrderIds: Set<number>,
    activeOrderIds: Set<number>,
    sensorLogPS: (
      ps: any,
      logType: "input" | "output" | "product",
      items: InventoryEntryWithDelay[]
    ) => boolean,
    sensorLogTS: (
      ts: any,
      logType: "input" | "output" | "product",
      items: InventoryEntryWithDelay[]
    ) => boolean
  ) {
    // Ensure we have a place for bottlenecks
    if (!newState.bottlenecks) {
      newState.bottlenecks = [];
    }

    for (const location of newState.locations) {
      for (const ps of location.processSteps) {
        if (!ps.active) continue;

        const effOutSpeed = Math.floor(
          ps.outputSpeed * ((ps as any).__inventoryMultiplier || 0)
        );
        if (effOutSpeed <= 0) continue;

        // which TS are "active"? We'll consider only active ones for distribution
        const activeOutputs = ps.outputs.filter((o) => o.active);
        const outputSpeeds = activeOutputs.map((o) =>
          Math.min(
            effOutSpeed,
            Math.floor(o.outputSpeed * ((o as any).__inventoryMultiplier || 1))
          )
        );

        // We do a round-robin distribution among these TS
        const itemsPerOutput = distributeRoundRobin(
          ps.inventory.entries
            .filter(
              (entry) => entry.orderId && activeOrderIds.has(entry.orderId)
            )
            .sort((a, b) => a.addedAt.getTime() - b.addedAt.getTime()),
          outputSpeeds,
          ps.outputs.map((o) =>
            o.filter
              ? (i: InventoryEntry) =>
                  o.filter!.entries.some((fe) => fe.material === i.material)
              : () => true
          )
        );

        // Move items to each TS
        for (let i = 0; i < itemsPerOutput.length; i++) {
          const ts = ps.outputs[i];
          const effTSOutSpeed = Math.floor(
            ts.outputSpeed * ((ts as any).__inventoryMultiplier || 0)
          );
          if (effTSOutSpeed <= 0) continue;

          // Log the PS "output" and TS "input"
          sensorLogPS(ps, "output", itemsPerOutput[i]);
          sensorLogTS(ts, "input", itemsPerOutput[i]);

          // Remove them from PS's inventory
          const outIds = new Set(itemsPerOutput[i].map((x) => x.id));
          ps.inventory.entries = ps.inventory.entries.filter(
            (e) => !outIds.has(e.id)
          );

          // Prepare the items to be inserted into TS
          const entriesOut = itemsPerOutput[i].map((item) => ({
            ...item,
            addedAt: new Date(),
            inventoryId: ts.inventory.id,
            arrivedTick: currentTick,
            slotNumber: undefined,
          })) as InventoryEntryWithDelay[];

          // If TS is full or inactive, queue them
          if (
            ts.inventory.entries.length + entriesOut.length >
              ts.inventory.limit ||
            !ts.active
          ) {
            // Put them in TS's queue
            (ts as any).__queue.push(...entriesOut);

            // Record a bottleneck event in newState
            newState.bottlenecks.push({
              tick: currentTick,
              name: ts.name,
            });

            // Optionally show a notification
            if (notificationsEnabled && entriesOut.length > 0) {
              // e.g. handleNotification("Queue", `${entriesOut.length} item(s) queued in TS`, "warning");
            }
          } else {
            // Enough space => push them directly to TS
            ts.inventory.entries.push(...entriesOut);

            for (const eo of entriesOut) {
              if (eo.orderId != null) {
                movedOrderIds.add(eo.orderId);
              }
            }
          }
        } // end for each TS
      }
    }
  }
}
