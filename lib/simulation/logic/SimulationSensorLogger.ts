// simulationSensorLogger.ts

import {
  ProcessStepFull,
  TransportSystemFull,
  InventoryEntryWithDelay,
} from "../Simulation";
import { LogEntry } from "@prisma/client";

export class SimulationSensorLogger {
  public static sensorLog(
    psOrTS: ProcessStepFull | TransportSystemFull,
    logType: "input" | "output" | "product",
    items: InventoryEntryWithDelay[]
  ): boolean {
    if (!("sensors" in psOrTS) || !Array.isArray(psOrTS.sensors)) {
      return true;
    }
    const isProcessStep = (entity: any): entity is ProcessStepFull =>
      "recipe" in entity;

    for (const sensor of psOrTS.sensors) {
      if (!sensor.active) continue;

      for (const i of items) {
        const newLog: LogEntry = {
          id: sensor.logEntries.length + 1,
          sensorId: sensor.id,
          createdAt: new Date(),
          materialId: i.id,
          materialName: i.material,
          inputType: logType,
          processStepId: isProcessStep(psOrTS) ? psOrTS.id : null,
          transportSystemId: !isProcessStep(psOrTS) ? psOrTS.id : null,
        };
        sensor.logEntries.push(newLog);
        if (logType === "product") sensor.value++;
      }

      console.log(
        `[SENSOR] ${sensor.name} logged ${items.length} items as "${logType}". sensor.value updated to: ${sensor.value}`
      );
    }
    return true;
  }
}
