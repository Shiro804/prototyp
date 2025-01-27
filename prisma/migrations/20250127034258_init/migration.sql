/*
  Warnings:

  - You are about to drop the column `injured` on the `Worker` table. All the data in the column will be lost.
  - You are about to drop the column `injuryRate` on the `Worker` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Resource" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "mandatory" BOOLEAN NOT NULL DEFAULT false,
    "productionResource" BOOLEAN NOT NULL DEFAULT false,
    "inventoryResource" BOOLEAN NOT NULL DEFAULT false,
    "locationId" INTEGER NOT NULL,
    "processStepId" INTEGER,
    "transportSystemId" INTEGER,
    "fault" BOOLEAN DEFAULT false,
    "faultyRate" REAL NOT NULL DEFAULT 0.01,
    CONSTRAINT "Resource_processStepId_fkey" FOREIGN KEY ("processStepId") REFERENCES "ProcessStep" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Resource_transportSystemId_fkey" FOREIGN KEY ("transportSystemId") REFERENCES "TransportSystem" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Resource_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Resource" ("active", "createdAt", "id", "inventoryResource", "locationId", "mandatory", "name", "processStepId", "productionResource", "transportSystemId", "updatedAt") SELECT "active", "createdAt", "id", "inventoryResource", "locationId", "mandatory", "name", "processStepId", "productionResource", "transportSystemId", "updatedAt" FROM "Resource";
DROP TABLE "Resource";
ALTER TABLE "new_Resource" RENAME TO "Resource";
CREATE TABLE "new_Worker" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "workerNumber" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "resourceId" INTEGER NOT NULL,
    CONSTRAINT "Worker_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Worker" ("address", "fullName", "id", "resourceId", "workerNumber") SELECT "address", "fullName", "id", "resourceId", "workerNumber" FROM "Worker";
DROP TABLE "Worker";
ALTER TABLE "new_Worker" RENAME TO "Worker";
CREATE UNIQUE INDEX "Worker_resourceId_key" ON "Worker"("resourceId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
