// logic/SimulationStepC.ts

import { SimulationEntityState, InventoryEntryWithDelay } from "../Simulation";
import { distributeRoundRobin } from "../round-robin";
import { InventoryEntry } from "@prisma/client";

export class SimulationStepC {
  // The verbatim logic for (C) OUTLET: PS -> TS, extracted:
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
    for (const location of newState.locations) {
      for (const ps of location.processSteps) {
        if (!ps.active) continue;

        const effOutSpeed = Math.floor(
          ps.outputSpeed * ((ps as any).__inventoryMultiplier || 0)
        );
        if (effOutSpeed <= 0) continue;

        const activeOutputs = ps.outputs.filter((o) => o.active);
        const outputSpeeds = activeOutputs.map((o) =>
          Math.min(
            effOutSpeed,
            Math.floor(o.outputSpeed * ((o as any).__inventoryMultiplier || 1))
          )
        );

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

        for (let i = 0; i < itemsPerOutput.length; i++) {
          const ts = ps.outputs[i];
          const effTSOutSpeed = Math.floor(
            ts.outputSpeed * ((ts as any).__inventoryMultiplier || 0)
          );
          if (effTSOutSpeed <= 0) continue;

          sensorLogPS(ps, "output", itemsPerOutput[i]);
          sensorLogTS(ts, "input", itemsPerOutput[i]);

          const outIds = new Set(itemsPerOutput[i].map((x) => x.id));
          // We'll rely on Simulation.freeSlots outside
          ps.inventory.entries = ps.inventory.entries.filter(
            (e) => !outIds.has(e.id)
          );

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
            (ts as any).__queue.push(...entriesOut);

            // [QUEUE NOTIF] for TS
            if (notificationsEnabled && entriesOut.length > 0) {
              // handleNotification(...) outside or replicate here
            }
          } else {
            ts.inventory.entries.push(...entriesOut);
            // We'll rely on Simulation.assignSlots(...) outside
            for (const eo of entriesOut) {
              if (eo.orderId != null) {
                movedOrderIds.add(eo.orderId);
              }
            }
          }
        }
      }
    }
  }
}
