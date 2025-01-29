-- CreateTable
CREATE TABLE "SimulationRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "KpiRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "key" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "simulationId" INTEGER NOT NULL,
    CONSTRAINT "KpiRecord_simulationId_fkey" FOREIGN KEY ("simulationId") REFERENCES "SimulationRecord" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
