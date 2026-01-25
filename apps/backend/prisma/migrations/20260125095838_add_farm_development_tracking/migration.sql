/*
  Warnings:

  - You are about to drop the column `category` on the `animals` table. All the data in the column will be lost.
  - Added the required column `lifeStage` to the `animals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `animals` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AnimalType" AS ENUM ('COW', 'BUFFALO');

-- CreateEnum
CREATE TYPE "LifeStage" AS ENUM ('CALF', 'HEIFER', 'ADULT');

-- CreateEnum
CREATE TYPE "FarmDevelopmentStatus" AS ENUM ('PLANNING', 'LAND_ACQUISITION', 'INFRASTRUCTURE', 'EQUIPMENT_SETUP', 'ANIMAL_ACQUISITION', 'OPERATIONAL');

-- CreateEnum
CREATE TYPE "DevelopmentStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MilestoneStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED');

-- AlterTable
ALTER TABLE "animals" DROP COLUMN "category",
ADD COLUMN     "lifeStage" "LifeStage" NOT NULL,
ADD COLUMN     "type" "AnimalType" NOT NULL;

-- AlterTable
ALTER TABLE "farms" ADD COLUMN     "developmentStatus" "FarmDevelopmentStatus" NOT NULL DEFAULT 'PLANNING',
ADD COLUMN     "estimatedCompletionDate" TIMESTAMP(3);

-- DropEnum
DROP TYPE "AnimalCategory";

-- CreateTable
CREATE TABLE "farm_development_phases" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "phaseName" TEXT NOT NULL,
    "description" TEXT,
    "phaseOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "DevelopmentStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "budget" DOUBLE PRECISION,
    "actualCost" DOUBLE PRECISION,
    "startDate" TIMESTAMP(3),
    "targetDate" TIMESTAMP(3),
    "completedDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "farm_development_phases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "development_milestones" (
    "id" TEXT NOT NULL,
    "phaseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "milestoneOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "MilestoneStatus" NOT NULL DEFAULT 'PENDING',
    "dueDate" TIMESTAMP(3),
    "completedDate" TIMESTAMP(3),
    "assignedToId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "development_milestones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "farm_development_phases_farmId_idx" ON "farm_development_phases"("farmId");

-- CreateIndex
CREATE INDEX "development_milestones_phaseId_idx" ON "development_milestones"("phaseId");

-- AddForeignKey
ALTER TABLE "farm_development_phases" ADD CONSTRAINT "farm_development_phases_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development_milestones" ADD CONSTRAINT "development_milestones_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "farm_development_phases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development_milestones" ADD CONSTRAINT "development_milestones_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
