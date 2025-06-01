-- CreateTable
CREATE TABLE "BottleneckRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "tick" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "simulationId" INTEGER NOT NULL,
    CONSTRAINT "BottleneckRecord_simulationId_fkey" FOREIGN KEY ("simulationId") REFERENCES "SimulationRecord" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
