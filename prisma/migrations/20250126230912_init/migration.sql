-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Resource" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "locationId" INTEGER NOT NULL,
    "processStepId" INTEGER,
    "transportSystemId" INTEGER,
    CONSTRAINT "Resource_processStepId_fkey" FOREIGN KEY ("processStepId") REFERENCES "ProcessStep" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Resource_transportSystemId_fkey" FOREIGN KEY ("transportSystemId") REFERENCES "TransportSystem" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Resource_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Resource" ("active", "createdAt", "id", "locationId", "name", "processStepId", "transportSystemId", "updatedAt") SELECT "active", "createdAt", "id", "locationId", "name", "processStepId", "transportSystemId", "updatedAt" FROM "Resource";
DROP TABLE "Resource";
ALTER TABLE "new_Resource" RENAME TO "Resource";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
