/*
  Warnings:

  - You are about to drop the `_tsInputs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_tsOutputs` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `type` on table `TransportSystem` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "_tsInputs_B_index";

-- DropIndex
DROP INDEX "_tsInputs_AB_unique";

-- DropIndex
DROP INDEX "_tsOutputs_B_index";

-- DropIndex
DROP INDEX "_tsOutputs_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_tsInputs";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_tsOutputs";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TransportSystem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "inputSpeed" INTEGER NOT NULL,
    "outputSpeed" INTEGER NOT NULL,
    "inventoryId" INTEGER NOT NULL,
    "minQuantity" INTEGER DEFAULT 1,
    "transportDelay" INTEGER DEFAULT 1,
    "startStepId" INTEGER,
    "endStepId" INTEGER,
    "type" TEXT NOT NULL,
    "startTSId" INTEGER,
    "endTSId" INTEGER,
    CONSTRAINT "TransportSystem_endStepId_fkey" FOREIGN KEY ("endStepId") REFERENCES "ProcessStep" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TransportSystem_startStepId_fkey" FOREIGN KEY ("startStepId") REFERENCES "ProcessStep" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TransportSystem_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TransportSystem" ("active", "createdAt", "endStepId", "id", "inputSpeed", "inventoryId", "minQuantity", "name", "outputSpeed", "startStepId", "transportDelay", "type", "updatedAt") SELECT "active", "createdAt", "endStepId", "id", "inputSpeed", "inventoryId", "minQuantity", "name", "outputSpeed", "startStepId", "transportDelay", "type", "updatedAt" FROM "TransportSystem";
DROP TABLE "TransportSystem";
ALTER TABLE "new_TransportSystem" RENAME TO "TransportSystem";
CREATE UNIQUE INDEX "TransportSystem_inventoryId_key" ON "TransportSystem"("inventoryId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
