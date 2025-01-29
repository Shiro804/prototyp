/*
  Warnings:

  - Added the required column `materialId` to the `LogEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `materialName` to the `LogEntry` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LogEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inputType" TEXT NOT NULL,
    "sensorId" INTEGER,
    "materialId" INTEGER NOT NULL,
    "materialName" TEXT NOT NULL,
    "processStepId" INTEGER,
    "transportSystemId" INTEGER,
    CONSTRAINT "LogEntry_sensorId_fkey" FOREIGN KEY ("sensorId") REFERENCES "Sensor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_LogEntry" ("createdAt", "id", "inputType", "processStepId", "sensorId", "transportSystemId") SELECT "createdAt", "id", "inputType", "processStepId", "sensorId", "transportSystemId" FROM "LogEntry";
DROP TABLE "LogEntry";
ALTER TABLE "new_LogEntry" RENAME TO "LogEntry";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
