-- CreateTable
CREATE TABLE "Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "_OrderToProcessStep" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_OrderToProcessStep_A_fkey" FOREIGN KEY ("A") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_OrderToProcessStep_B_fkey" FOREIGN KEY ("B") REFERENCES "ProcessStep" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_OrderToTransportSystem" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_OrderToTransportSystem_A_fkey" FOREIGN KEY ("A") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_OrderToTransportSystem_B_fkey" FOREIGN KEY ("B") REFERENCES "TransportSystem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_InventoryEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "material" TEXT NOT NULL,
    "inventoryId" INTEGER NOT NULL,
    "orderId" INTEGER,
    CONSTRAINT "InventoryEntry_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "InventoryEntry_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_InventoryEntry" ("addedAt", "id", "inventoryId", "material") SELECT "addedAt", "id", "inventoryId", "material" FROM "InventoryEntry";
DROP TABLE "InventoryEntry";
ALTER TABLE "new_InventoryEntry" RENAME TO "InventoryEntry";
CREATE TABLE "new_Recipe" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Recipe" ("createdAt", "id", "name", "updatedAt") SELECT "createdAt", "id", "name", "updatedAt" FROM "Recipe";
DROP TABLE "Recipe";
ALTER TABLE "new_Recipe" RENAME TO "Recipe";
CREATE TABLE "new_TransportSystem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "inputSpeed" INTEGER NOT NULL,
    "outputSpeed" INTEGER NOT NULL,
    "inventoryId" INTEGER NOT NULL,
    "startStepId" INTEGER,
    "endStepId" INTEGER,
    CONSTRAINT "TransportSystem_endStepId_fkey" FOREIGN KEY ("endStepId") REFERENCES "ProcessStep" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TransportSystem_startStepId_fkey" FOREIGN KEY ("startStepId") REFERENCES "ProcessStep" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TransportSystem_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TransportSystem" ("active", "createdAt", "endStepId", "id", "inputSpeed", "inventoryId", "name", "outputSpeed", "startStepId", "updatedAt") SELECT "active", "createdAt", "endStepId", "id", "inputSpeed", "inventoryId", "name", "outputSpeed", "startStepId", "updatedAt" FROM "TransportSystem";
DROP TABLE "TransportSystem";
ALTER TABLE "new_TransportSystem" RENAME TO "TransportSystem";
CREATE UNIQUE INDEX "TransportSystem_inventoryId_key" ON "TransportSystem"("inventoryId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_OrderToProcessStep_AB_unique" ON "_OrderToProcessStep"("A", "B");

-- CreateIndex
CREATE INDEX "_OrderToProcessStep_B_index" ON "_OrderToProcessStep"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_OrderToTransportSystem_AB_unique" ON "_OrderToTransportSystem"("A", "B");

-- CreateIndex
CREATE INDEX "_OrderToTransportSystem_B_index" ON "_OrderToTransportSystem"("B");
