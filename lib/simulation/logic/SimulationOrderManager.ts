// simulationOrderManager.ts

import { Order } from "@prisma/client";
import { SimulationEntityState, InventoryEntryWithDelay } from "../Simulation";
import { handleNotification } from "@/app/notification-settings/page";

/**
 * Manages the lifecycle of orders within the simulation, including material reservation,
 * order completion tracking, and relationship management between orders and process steps.
 */
export class SimulationOrderManager {
  /**
   * Processes pending orders by attempting to reserve required materials.
   * @param orders Array of orders to process
   * @param state Current state of the simulation
   * @param notificationsEnabled Flag to control notification display
   */
  public static handleOrders(
    orders: (Order & { materialsReserved?: boolean })[],
    state: SimulationEntityState,
    notificationsEnabled: boolean
  ): void {
    if (orders.length === 0) return;
    const pending = orders.filter(
      (o) => o.status === "pending" && !o.materialsReserved
    );

    for (const order of pending) {
      const required = this.getRequiredMaterialsForOrder(order);
      if (required) {
        const success = this.reserveMaterialsForOrder(
          order,
          required,
          state,
          notificationsEnabled
        );
        if (success) {
          order.materialsReserved = true;
        } else {
          notificationsEnabled &&
            handleNotification(
              "Order Reservation",
              `Order ${order.id}: Nicht genügend Materialien reserviert.`,
              "error"
            );
        }
      }
    }
  }

  /**
   * Determines the list of materials required for a given order.
   * Returns a list of standard components needed for seat manufacturing.
   * @param order The order to analyze
   * @returns Array of required materials or null if order quantity is invalid
   */
  private static getRequiredMaterialsForOrder(
    order: Order & { materialsReserved?: boolean }
  ): { material: string }[] | null {
    if (!order.quantity || order.quantity < 1) return null;
    const baseMaterials = [
      "Seat Structure",
      "Backrest Structure",
      "Seat Foam",
      "Backrest Foam",
      "Headrest",
      "Airbag",
      "Small Part",
      "Seat Cover",
      "Backrest Cover",
    ];
    return baseMaterials.map((m) => ({ material: m }));
  }

  /**
   * Attempts to reserve materials for an order across all locations.
   * If insufficient materials are available, reverts any partial reservations.
   * @param order The order requiring materials
   * @param materials List of materials to reserve
   * @param state Current simulation state
   * @param notificationsEnabled Flag to control notifications
   * @returns boolean indicating if reservation was successful
   */
  private static reserveMaterialsForOrder(
    order: Order & { materialsReserved?: boolean },
    materials: { material: string }[],
    state: SimulationEntityState,
    notificationsEnabled: boolean
  ): boolean {
    let allOk = true;
    for (const mat of materials) {
      let needed = order.quantity;
      for (const loc of state.locations) {
        for (const ps of loc.processSteps) {
          const avail = ps.inventory.entries.filter(
            (e) => e.material === mat.material && !e.orderId
          );
          for (const e of avail) {
            if (needed <= 0) break;
            e.orderId = order.id;
            needed--;
          }
          if (needed <= 0) break;
        }
        if (needed <= 0) break;
      }
      if (needed > 0) {
        allOk = false;
        // revert partial reservations
        for (const loc of state.locations) {
          for (const ps of loc.processSteps) {
            for (const e of ps.inventory.entries) {
              if (e.orderId === order.id && e.material === mat.material) {
                e.orderId = null;
              }
            }
          }
        }
        break;
      }
    }
    return allOk;
  }

  /**
   * Checks if orders can be marked as completed based on completed seats in shipping.
   * Updates order status and timestamps when completion criteria are met.
   * @param orders List of orders to check
   * @param state Current simulation state
   * @param currentTick Current simulation tick
   * @param notificationsEnabled Flag to control notifications
   */
  public static checkAndCompleteOrders(
    orders: (Order & { materialsReserved?: boolean })[],
    state: SimulationEntityState,
    currentTick: number,
    notificationsEnabled: boolean
  ): void {
    const shippingIds = state.locations
      .flatMap((l) => l.processSteps)
      .filter((p) => p.name === "Shipping")
      .map((p) => p.inventory.id);

    for (const order of orders) {
      if (order.status === "completed") continue;
      const seats = state.locations
        .flatMap((l) => l.processSteps)
        .flatMap((p) => p.inventory.entries)
        .filter(
          (e) =>
            e.orderId === order.id &&
            this.isSeatCompleted(e.material) &&
            shippingIds.includes(e.inventoryId)
        ).length;

      if (seats >= order.quantity) {
        order.status = "completed";
        order.completedAt = new Date();
        (order as any).completedTick = currentTick;
        if (notificationsEnabled) {
          handleNotification(
            "Order Completed",
            `Order ${order.id} wurde abgeschlossen.`,
            "success"
          );
        }
      }
    }
  }

  /**
   * Checks if a material represents a completed seat
   * @param material Material to check
   * @returns boolean indicating if the material is a completed seat
   */
  private static isSeatCompleted(material: string): boolean {
    return material === "Complete Seat";
  }

  /**
   * Updates the relationships between orders and process steps/transport systems.
   * Maintains bidirectional references between orders and their associated components.
   * @param orders List of orders to update relationships for
   * @param state Current simulation state
   */
  public static updateOrderRelationships(
    orders: (Order & { materialsReserved?: boolean })[],
    state: SimulationEntityState
  ): void {
    const orderMap = new Map<number, Order & { materialsReserved?: boolean }>();
    for (const o of orders) {
      orderMap.set(o.id, o);
    }

    for (const loc of state.locations) {
      for (const ps of loc.processSteps) {
        const stepOrderIds = new Set<number>(
          ps.inventory.entries
            .filter((entry) => entry.orderId != null)
            .map((entry) => entry.orderId as number)
        );
        ps.orders = [...stepOrderIds]
          .map((oid) => orderMap.get(oid))
          .filter((o): o is Order => o != null);

        for (const inputTS of ps.inputs) {
          const tsOrderIds = new Set<number>(
            inputTS.inventory.entries
              .filter((entry) => entry.orderId != null)
              .map((entry) => entry.orderId as number)
          );
          inputTS.orders = [...tsOrderIds]
            .map((oid) => orderMap.get(oid))
            .filter((o): o is Order => o != null);
        }

        for (const outputTS of ps.outputs) {
          const tsOrderIds = new Set<number>(
            outputTS.inventory.entries
              .filter((entry) => entry.orderId != null)
              .map((entry) => entry.orderId as number)
          );
          outputTS.orders = [...tsOrderIds]
            .map((oid) => orderMap.get(oid))
            .filter((o): o is Order => o != null);
        }
      }
    }
    console.log("Order relationships updated:", state.locations);
  }
}
