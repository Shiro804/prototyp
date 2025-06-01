// simulationSensorLogger.ts

import {
  ProcessStepFull,
  TransportSystemFull,
  InventoryEntryWithDelay,
} from "../Simulation";
import { LogEntry } from "@prisma/client";

/**
 * Class responsible for logging sensor data during simulation of process steps and transport systems
 */
export class SimulationSensorLogger {
  /**
   * Logs sensor data for process steps or transport systems
   * @param psOrTS - The process step or transport system being monitored
   * @param logType - Type of log entry ('input', 'output', or 'product')
   * @param items - Array of inventory items to be logged
   * @returns true if logging is successful, true if entity has no sensors
   */
  public static sensorLog(
    psOrTS: ProcessStepFull | TransportSystemFull,
    logType: "input" | "output" | "product",
    items: InventoryEntryWithDelay[]
  ): boolean {
    // Return if the entity doesn't have sensors or sensors array is invalid
    if (!("sensors" in psOrTS) || !Array.isArray(psOrTS.sensors)) {
      return true;
    }

    // Type guard to determine if the entity is a ProcessStep
    const isProcessStep = (entity: any): entity is ProcessStepFull =>
      "recipe" in entity;

    // Iterate through all sensors of the entity
    for (const sensor of psOrTS.sensors) {
      // Skip inactive sensors
      if (!sensor.active) continue;

      // Create a log entry for each item being processed
      for (const i of items) {
        const newLog: LogEntry = {
          id: sensor.logEntries.length + 1,
          sensorId: sensor.id,
          createdAt: new Date(),
          materialId: i.id,
          materialName: i.material,
          inputType: logType,
          // Set appropriate IDs based on entity type
          processStepId: isProcessStep(psOrTS) ? psOrTS.id : null,
          transportSystemId: !isProcessStep(psOrTS) ? psOrTS.id : null,
        };
        // Add the log entry to sensor's history
        sensor.logEntries.push(newLog);
        // Increment sensor value counter for product type logs
        if (logType === "product") sensor.value++;
      }

      // Log sensor activity to console
      console.log(
        `[SENSOR] ${sensor.name} logged ${items.length} items as "${logType}". sensor.value updated to: ${sensor.value}`
      );
    }
    return true;
  }
}
