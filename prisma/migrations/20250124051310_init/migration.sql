/*
  Warnings:

  - You are about to drop the column `endTSId` on the `TransportSystem` table. All the data in the column will be lost.
  - You are about to drop the column `startTSId` on the `TransportSystem` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_tsInputs" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_tsInputs_A_fkey" FOREIGN KEY ("A") REFERENCES "TransportSystem" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_tsInputs_B_fkey" FOREIGN KEY ("B") REFERENCES "TransportSystem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_tsOutputs" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_tsOutputs_A_fkey" FOREIGN KEY ("A") REFERENCES "TransportSystem" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_tsOutputs_B_fkey" FOREIGN KEY ("B") REFERENCES "TransportSystem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

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
    "type" TEXT,
    "startStepId" INTEGER,
    "endStepId" INTEGER,
    CONSTRAINT "TransportSystem_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TransportSystem_endStepId_fkey" FOREIGN KEY ("endStepId") REFERENCES "ProcessStep" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TransportSystem_startStepId_fkey" FOREIGN KEY ("startStepId") REFERENCES "ProcessStep" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_TransportSystem" ("active", "createdAt", "endStepId", "id", "inputSpeed", "inventoryId", "minQuantity", "name", "outputSpeed", "startStepId", "transportDelay", "type", "updatedAt") SELECT "active", "createdAt", "endStepId", "id", "inputSpeed", "inventoryId", "minQuantity", "name", "outputSpeed", "startStepId", "transportDelay", "type", "updatedAt" FROM "TransportSystem";
DROP TABLE "TransportSystem";
ALTER TABLE "new_TransportSystem" RENAME TO "TransportSystem";
CREATE UNIQUE INDEX "TransportSystem_inventoryId_key" ON "TransportSystem"("inventoryId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_tsInputs_AB_unique" ON "_tsInputs"("A", "B");

-- CreateIndex
CREATE INDEX "_tsInputs_B_index" ON "_tsInputs"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_tsOutputs_AB_unique" ON "_tsOutputs"("A", "B");

-- CreateIndex
CREATE INDEX "_tsOutputs_B_index" ON "_tsOutputs"("B");
