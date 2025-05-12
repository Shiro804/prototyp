// logic/SimulationStepD.ts

import { SimulationEntityState, InventoryEntryWithDelay } from "../Simulation";
import { InventoryEntry } from "@prisma/client";

export class SimulationStepD {
  /**
   * (D) INTAKE: Move items from TS to PS. If the PS is full, we queue them into PS.__queue
   * and record a bottleneck event in newState.bottlenecks.
   */
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
    // Ensure we have a place for bottlenecks
    if (!newState.bottlenecks) {
      newState.bottlenecks = [];
    }

    // We'll see if the source has more items
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

          // Find items in the TS that are ready to move
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

          // If minQuantity is set, ensure we have enough items
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

          // We'll do a simple FIFO from the TS
          const sortedPotentials = potentialItems.sort(
            (a, b) => a.addedAt.getTime() - b.addedAt.getTime()
          );

          const acceptedItems: InventoryEntryWithDelay[] = [];
          for (const candidate of sortedPotentials) {
            if (acceptedItems.length >= speedIn) break;

            // If the PS is at capacity, we queue items
            if (
              ps.inventory.entries.length + acceptedItems.length >=
              ps.inventory.limit
            ) {
              // We queue them => record a bottleneck
              (ps as any).__queue.push(candidate);

              newState.bottlenecks.push({
                tick: currentTick,
                name: ps.name,
              });

              if (notificationsEnabled) {
                // e.g. handleNotification("Queue", `1 item queued in ProcessStep (${ps.name})`, "warning");
              }
              continue;
            }

            // Test if we can intake them
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

          // Log the TS "output" and PS "input"
          sensorLogTS(input, "output", acceptedItems);
          sensorLogPS(ps, "input", acceptedItems);

          // Update TS Duration
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

          // Remove them from TS
          const acceptedIds = new Set(acceptedItems.map((x) => x.id));
          input.inventory.entries = input.inventory.entries.filter(
            (e) => !acceptedIds.has(e.id)
          );

          // Add them to PS
          for (const item of acceptedItems) {
            const newItem: InventoryEntryWithDelay = {
              ...item,
              addedAt: new Date(),
              inventoryId: ps.inventory.id,
              slotNumber: undefined,
            };
            ps.inventory.entries.push(newItem);

            if (newItem.orderId != null) {
              movedOrderIds.add(newItem.orderId);
            }
          }
        } // end for each input
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
