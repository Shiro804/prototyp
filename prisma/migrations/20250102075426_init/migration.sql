/*
  Warnings:

  - You are about to drop the column `canceledAt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `completedAt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `dueDate` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Filter" ADD COLUMN "orderId" INTEGER;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Order" ("createdAt", "id", "updatedAt") SELECT "createdAt", "id", "updatedAt" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE TABLE "new_Recipe" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Recipe" ("createdAt", "id", "name", "updatedAt") SELECT "createdAt", "id", "name", "updatedAt" FROM "Recipe";
DROP TABLE "Recipe";
ALTER TABLE "new_Recipe" RENAME TO "Recipe";
CREATE TABLE "new_TransportSystem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
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
