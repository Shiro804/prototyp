/*
  Warnings:

  - You are about to drop the column `arrivedTick` on the `InventoryEntry` table. All the data in the column will be lost.

*/
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
INSERT INTO "new_InventoryEntry" ("addedAt", "id", "inventoryId", "material", "orderId") SELECT "addedAt", "id", "inventoryId", "material", "orderId" FROM "InventoryEntry";
DROP TABLE "InventoryEntry";
ALTER TABLE "new_InventoryEntry" RENAME TO "InventoryEntry";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
