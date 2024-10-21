-- CreateTable
CREATE TABLE "Resource" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "locationId" INTEGER NOT NULL,
    "processStepId" INTEGER NOT NULL,
    CONSTRAINT "Resource_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Resource_processStepId_fkey" FOREIGN KEY ("processStepId") REFERENCES "ProcessStep" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Machine" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "resourceId" INTEGER NOT NULL,
    CONSTRAINT "Machine_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Worker" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "resourceId" INTEGER NOT NULL,
    CONSTRAINT "Worker_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WorkerRole" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "Inventory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "type" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "InventoryEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "material" TEXT NOT NULL,
    "inventoryId" INTEGER NOT NULL,
    CONSTRAINT "InventoryEntry_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Location" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "ProcessStep" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "inputSpeed" INTEGER NOT NULL,
    "outputSpeed" INTEGER NOT NULL,
    "recipeRate" INTEGER NOT NULL DEFAULT 1,
    "locationId" INTEGER NOT NULL,
    "inventoryId" INTEGER NOT NULL,
    "recipeId" INTEGER,
    CONSTRAINT "ProcessStep_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProcessStep_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProcessStep_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Recipe" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "RecipeInput" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "material" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "recipeId" INTEGER,
    CONSTRAINT "RecipeInput_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RecipeOutput" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "material" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "recipeId" INTEGER,
    CONSTRAINT "RecipeOutput_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Sensor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "processStepId" INTEGER NOT NULL,
    CONSTRAINT "Sensor_processStepId_fkey" FOREIGN KEY ("processStepId") REFERENCES "ProcessStep" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TransportSystem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "inputSpeed" INTEGER NOT NULL,
    "outputSpeed" INTEGER NOT NULL,
    "inventoryId" INTEGER NOT NULL,
    "startStepId" INTEGER,
    "endStepId" INTEGER,
    CONSTRAINT "TransportSystem_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TransportSystem_startStepId_fkey" FOREIGN KEY ("startStepId") REFERENCES "ProcessStep" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TransportSystem_endStepId_fkey" FOREIGN KEY ("endStepId") REFERENCES "ProcessStep" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_WorkerToWorkerRole" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_WorkerToWorkerRole_A_fkey" FOREIGN KEY ("A") REFERENCES "Worker" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_WorkerToWorkerRole_B_fkey" FOREIGN KEY ("B") REFERENCES "WorkerRole" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Machine_resourceId_key" ON "Machine"("resourceId");

-- CreateIndex
CREATE UNIQUE INDEX "Worker_resourceId_key" ON "Worker"("resourceId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkerRole_name_key" ON "WorkerRole"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProcessStep_inventoryId_key" ON "ProcessStep"("inventoryId");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeInput_material_recipeId_key" ON "RecipeInput"("material", "recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "TransportSystem_inventoryId_key" ON "TransportSystem"("inventoryId");

-- CreateIndex
CREATE UNIQUE INDEX "_WorkerToWorkerRole_AB_unique" ON "_WorkerToWorkerRole"("A", "B");

-- CreateIndex
CREATE INDEX "_WorkerToWorkerRole_B_index" ON "_WorkerToWorkerRole"("B");
