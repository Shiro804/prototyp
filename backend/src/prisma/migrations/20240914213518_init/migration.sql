/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `GPSTracker` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EventToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "WorkstationType" AS ENUM ('Assembly', 'Inspection', 'Packaging', 'Welding', 'Painting', 'QualityControl', 'Machining', 'MaterialHandling', 'Maintenance', 'Storage');

-- CreateEnum
CREATE TYPE "TransportSystemStatus" AS ENUM ('Operational', 'Maintenance', 'Offline', 'InTransit', 'Idle', 'Loading', 'Unloading');

-- AlterEnum
ALTER TYPE "SensorType" ADD VALUE 'FinishedProductCounter';

-- DropForeignKey
ALTER TABLE "GPSTracker" DROP CONSTRAINT "GPSTracker_transportId_fkey";

-- DropForeignKey
ALTER TABLE "_EventToUser" DROP CONSTRAINT "_EventToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_EventToUser" DROP CONSTRAINT "_EventToUser_B_fkey";

-- AlterTable
ALTER TABLE "Machine" ADD COLUMN     "lastMaintenance" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Metric" ADD COLUMN     "targetValue" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "QualityCheck" ADD COLUMN     "machineId" INTEGER,
ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "Sensor" ADD COLUMN     "maxThreshold" DOUBLE PRECISION,
ADD COLUMN     "minThreshold" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "TransportSystem" ADD COLUMN     "status" "TransportSystemStatus" NOT NULL DEFAULT 'Operational';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "eventId" INTEGER;

-- AlterTable
ALTER TABLE "Workstation" ADD COLUMN     "type" "WorkstationType" NOT NULL DEFAULT 'Assembly';

-- DropTable
DROP TABLE "GPSTracker";

-- DropTable
DROP TABLE "_EventToUser";

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RoleToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_RoleToUser_AB_unique" ON "_RoleToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_RoleToUser_B_index" ON "_RoleToUser"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QualityCheck" ADD CONSTRAINT "QualityCheck_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QualityCheck" ADD CONSTRAINT "QualityCheck_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToUser" ADD CONSTRAINT "_RoleToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToUser" ADD CONSTRAINT "_RoleToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
