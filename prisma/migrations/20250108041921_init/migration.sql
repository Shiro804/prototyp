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
    "transportDelay" INTEGER DEFAULT 1,
    "inventoryId" INTEGER NOT NULL,
    "startStepId" INTEGER,
    "endStepId" INTEGER,
    CONSTRAINT "TransportSystem_endStepId_fkey" FOREIGN KEY ("endStepId") REFERENCES "ProcessStep" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TransportSystem_startStepId_fkey" FOREIGN KEY ("startStepId") REFERENCES "ProcessStep" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TransportSystem_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TransportSystem" ("active", "createdAt", "endStepId", "id", "inputSpeed", "inventoryId", "name", "outputSpeed", "startStepId", "transportDelay", "updatedAt") SELECT "active", "createdAt", "endStepId", "id", "inputSpeed", "inventoryId", "name", "outputSpeed", "startStepId", "transportDelay", "updatedAt" FROM "TransportSystem";
DROP TABLE "TransportSystem";
ALTER TABLE "new_TransportSystem" RENAME TO "TransportSystem";
CREATE UNIQUE INDEX "TransportSystem_inventoryId_key" ON "TransportSystem"("inventoryId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
