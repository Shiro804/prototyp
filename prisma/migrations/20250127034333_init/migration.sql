/*
  Warnings:

  - You are about to drop the column `fault` on the `Resource` table. All the data in the column will be lost.

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
    "faulty" BOOLEAN DEFAULT false,
    "faultyRate" REAL NOT NULL DEFAULT 0.01,
    CONSTRAINT "Resource_processStepId_fkey" FOREIGN KEY ("processStepId") REFERENCES "ProcessStep" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Resource_transportSystemId_fkey" FOREIGN KEY ("transportSystemId") REFERENCES "TransportSystem" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Resource_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Resource" ("active", "createdAt", "faultyRate", "id", "inventoryResource", "locationId", "mandatory", "name", "processStepId", "productionResource", "transportSystemId", "updatedAt") SELECT "active", "createdAt", "faultyRate", "id", "inventoryResource", "locationId", "mandatory", "name", "processStepId", "productionResource", "transportSystemId", "updatedAt" FROM "Resource";
DROP TABLE "Resource";
ALTER TABLE "new_Resource" RENAME TO "Resource";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
