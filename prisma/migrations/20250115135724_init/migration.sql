/*
  Warnings:

  - You are about to drop the column `totalRecipeTransformations` on the `ProcessStep` table. All the data in the column will be lost.
  - Added the required column `type` to the `Sensor` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProcessStep" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "inputSpeed" INTEGER NOT NULL,
    "outputSpeed" INTEGER NOT NULL,
    "recipeRate" INTEGER NOT NULL DEFAULT 10,
    "duration" INTEGER NOT NULL DEFAULT 1,
    "locationId" INTEGER NOT NULL,
    "inventoryId" INTEGER NOT NULL,
    "recipeId" INTEGER,
    CONSTRAINT "ProcessStep_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ProcessStep_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProcessStep_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProcessStep" ("createdAt", "duration", "id", "inputSpeed", "inventoryId", "locationId", "name", "outputSpeed", "recipeId", "recipeRate", "status", "updatedAt") SELECT "createdAt", "duration", "id", "inputSpeed", "inventoryId", "locationId", "name", "outputSpeed", "recipeId", "recipeRate", "status", "updatedAt" FROM "ProcessStep";
DROP TABLE "ProcessStep";
ALTER TABLE "new_ProcessStep" RENAME TO "ProcessStep";
CREATE UNIQUE INDEX "ProcessStep_inventoryId_key" ON "ProcessStep"("inventoryId");
CREATE TABLE "new_Sensor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 0,
    "sensorDelay" INTEGER NOT NULL DEFAULT 0,
    "materialList" TEXT,
    "processStepId" INTEGER,
    "transportSystemId" INTEGER,
    CONSTRAINT "Sensor_processStepId_fkey" FOREIGN KEY ("processStepId") REFERENCES "ProcessStep" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Sensor_transportSystemId_fkey" FOREIGN KEY ("transportSystemId") REFERENCES "TransportSystem" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Sensor" ("createdAt", "id", "name", "processStepId", "updatedAt") SELECT "createdAt", "id", "name", "processStepId", "updatedAt" FROM "Sensor";
DROP TABLE "Sensor";
ALTER TABLE "new_Sensor" RENAME TO "Sensor";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
