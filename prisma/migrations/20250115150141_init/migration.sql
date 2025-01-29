/*
  Warnings:

  - You are about to drop the column `materialList` on the `Sensor` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Sensor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 0,
    "sensorDelay" INTEGER NOT NULL DEFAULT 0,
    "processStepId" INTEGER,
    "transportSystemId" INTEGER,
    CONSTRAINT "Sensor_processStepId_fkey" FOREIGN KEY ("processStepId") REFERENCES "ProcessStep" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Sensor_transportSystemId_fkey" FOREIGN KEY ("transportSystemId") REFERENCES "TransportSystem" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Sensor" ("createdAt", "id", "name", "processStepId", "sensorDelay", "transportSystemId", "type", "updatedAt", "value") SELECT "createdAt", "id", "name", "processStepId", "sensorDelay", "transportSystemId", "type", "updatedAt", "value" FROM "Sensor";
DROP TABLE "Sensor";
ALTER TABLE "new_Sensor" RENAME TO "Sensor";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
