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
    "duration" INTEGER NOT NULL DEFAULT 10,
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
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
