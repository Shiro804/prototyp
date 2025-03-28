// logic/SimulationStepD.ts

import { SimulationEntityState, InventoryEntryWithDelay } from "../Simulation";
import { InventoryEntry } from "@prisma/client";

export class SimulationStepD {
  // The verbatim logic for (D) INTAKE: TS -> PS, extracted:
  public static handleIntake(
    newState: SimulationEntityState,
    currentTick: number,
    defaultTransportDelay: number,
    notificationsEnabled: boolean,
    movedOrderIds: Set<number>,
    activeOrderIds: Set<number>,
    tsDurationMap: Record<string, number[]>,
    pushTsDuration: (tsType: string, diff: number) => void,
    sensorLogPS: (
      ps: any,
      logType: "input" | "output",
      items: InventoryEntryWithDelay[]
    ) => boolean,
    sensorLogTS: (
      ts: any,
      logType: "input" | "output",
      items: InventoryEntryWithDelay[]
    ) => boolean,
    canIntakeItems: (ps: any, inputItems: InventoryEntryWithDelay[]) => boolean
  ) {
    const sourceAvailability = new Map<number, boolean>();
    for (const loc of newState.locations) {
      for (const ps of loc.processSteps) {
        if (!ps.active) continue;
        for (const inp of ps.inputs) {
          if (!inp.active || !inp.startStepId) continue;
          if (!sourceAvailability.has(inp.startStepId)) {
            const canExpect = canExpectMoreItemsFromSource(
              newState,
              inp.startStepId,
              activeOrderIds
            );
            sourceAvailability.set(inp.startStepId, canExpect);
          }
        }
      }
    }

    for (const loc of newState.locations) {
      for (const ps of loc.processSteps) {
        if (!ps.active) continue;

        const effInSpeed = Math.floor(
          ps.inputSpeed * ((ps as any).__inventoryMultiplier || 0)
        );
        if (effInSpeed <= 0) continue;

        for (const input of ps.inputs) {
          if (!input.active) continue;

          const capacityNow = ps.inventory.limit - ps.inventory.entries.length;
          if (capacityNow <= 0) continue;

          const speedIn = Math.min(
            effInSpeed,
            Math.floor(
              input.outputSpeed * ((input as any).__inventoryMultiplier || 0)
            )
          );
          if (speedIn <= 0) continue;

          const potentialItems = input.inventory.entries.filter((entry) => {
            if (!entry.orderId || !activeOrderIds.has(entry.orderId)) {
              return false;
            }
            const delayedEntry = entry as InventoryEntryWithDelay;
            if (delayedEntry.arrivedTick == null) return false;
            const delayNeeded =
              input.transportDelay != null && input.transportDelay >= 0
                ? input.transportDelay
                : defaultTransportDelay;
            return currentTick - delayedEntry.arrivedTick >= delayNeeded;
          });

          if (potentialItems.length === 0) continue;

          if (
            input.minQuantity != null &&
            input.minQuantity > 0 &&
            potentialItems.length < input.minQuantity
          ) {
            const sourceStepId = input.startStepId ?? -1;
            const sourceEmpty = !sourceAvailability.get(sourceStepId);
            if (!sourceEmpty) {
              continue;
            }
          }

          // We'll do a simple FIFO
          const sortedPotentials = potentialItems.sort(
            (a, b) => a.addedAt.getTime() - b.addedAt.getTime()
          );

          const acceptedItems: InventoryEntryWithDelay[] = [];
          for (const candidate of sortedPotentials) {
            if (acceptedItems.length >= speedIn) break;
            if (
              ps.inventory.entries.length + acceptedItems.length >=
              ps.inventory.limit
            ) {
              // [QUEUE CODE + NOTIF] If PS is full => queue items
              (ps as any).__queue.push(candidate);

              if (notificationsEnabled) {
                // handleNotification(...) outside or replicate here
              }
              continue;
            }
            const testItem: InventoryEntryWithDelay = {
              ...candidate,
              inventoryId: ps.inventory.id,
            };
            const testArray = [...acceptedItems, testItem];
            if (canIntakeItems(ps, testArray)) {
              acceptedItems.push(candidate);
            }
          }

          if (acceptedItems.length === 0) {
            continue;
          }

          sensorLogTS(input, "output", acceptedItems);
          sensorLogPS(ps, "input", acceptedItems);

          for (const movedItem of acceptedItems) {
            const typed = movedItem as InventoryEntryWithDelay;
            if (typed.arrivedTick != null) {
              typed.leftTick = currentTick;
              const diff = typed.leftTick - typed.arrivedTick;
              if (diff >= 0) {
                const tsType = input.type || "Unknown";
                pushTsDuration(tsType, diff);
              }
            }
          }

          const acceptedIds = new Set(acceptedItems.map((x) => x.id));
          // We'll rely on Simulation.freeSlots outside
          input.inventory.entries = input.inventory.entries.filter(
            (e) => !acceptedIds.has(e.id)
          );

          for (const item of acceptedItems) {
            const newItem: InventoryEntryWithDelay = {
              ...item,
              addedAt: new Date(),
              inventoryId: ps.inventory.id,
              slotNumber: undefined,
            };
            ps.inventory.entries.push(newItem);
            // We'll rely on Simulation.assignSlots(...) outside
            if (newItem.orderId != null) {
              movedOrderIds.add(newItem.orderId);
            }
          }
        }
      }
    }

    function canExpectMoreItemsFromSource(
      state: SimulationEntityState,
      sourceStepId: number | null | undefined,
      activeOrderIds: Set<number>
    ): boolean {
      if (!sourceStepId) return false;
      const sourceStep = state.locations
        .flatMap((xx) => xx.processSteps)
        .find((procStep) => procStep.id === sourceStepId);
      if (!sourceStep) return false;
      return sourceStep.inventory.entries.some(
        (it) => it.orderId && activeOrderIds.has(it.orderId)
      );
    }
  }
}
