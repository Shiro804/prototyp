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
    "type" TEXT,
    "startTSId" INTEGER,
    "endTSId" INTEGER,
    CONSTRAINT "TransportSystem_endStepId_fkey" FOREIGN KEY ("endStepId") REFERENCES "ProcessStep" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TransportSystem_startStepId_fkey" FOREIGN KEY ("startStepId") REFERENCES "ProcessStep" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TransportSystem_startTSId_fkey" FOREIGN KEY ("startTSId") REFERENCES "TransportSystem" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TransportSystem_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TransportSystem" ("active", "createdAt", "endStepId", "endTSId", "id", "inputSpeed", "inventoryId", "minQuantity", "name", "outputSpeed", "startStepId", "startTSId", "transportDelay", "type", "updatedAt") SELECT "active", "createdAt", "endStepId", "endTSId", "id", "inputSpeed", "inventoryId", "minQuantity", "name", "outputSpeed", "startStepId", "startTSId", "transportDelay", "type", "updatedAt" FROM "TransportSystem";
DROP TABLE "TransportSystem";
ALTER TABLE "new_TransportSystem" RENAME TO "TransportSystem";
CREATE UNIQUE INDEX "TransportSystem_inventoryId_key" ON "TransportSystem"("inventoryId");
CREATE UNIQUE INDEX "TransportSystem_startTSId_key" ON "TransportSystem"("startTSId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
