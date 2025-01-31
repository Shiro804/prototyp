-- CreateTable
CREATE TABLE "LogEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inputType" TEXT NOT NULL,
    "sensorId" INTEGER,
    "processStepId" INTEGER,
    "transportSystemId" INTEGER,
    CONSTRAINT "LogEntry_sensorId_fkey" FOREIGN KEY ("sensorId") REFERENCES "Sensor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
