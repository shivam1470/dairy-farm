/*
  Warnings:

  - You are about to drop the column `createdBy` on the `delivery_logs` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `delivery_logs` table. All the data in the column will be lost.
  - You are about to drop the column `destination` on the `delivery_logs` table. All the data in the column will be lost.
  - You are about to drop the column `invoiceNumber` on the `delivery_logs` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `delivery_logs` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `delivery_logs` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `expenses` table. All the data in the column will be lost.
  - You are about to drop the column `invoiceNumber` on the `expenses` table. All the data in the column will be lost.
  - You are about to drop the column `vendorName` on the `expenses` table. All the data in the column will be lost.
  - The `paymentMethod` column on the `expenses` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `recordedBy` on the `feeding_logs` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `feeding_logs` table. All the data in the column will be lost.
  - You are about to drop the column `eveningQuantity` on the `milk_records` table. All the data in the column will be lost.
  - You are about to drop the column `morningQuantity` on the `milk_records` table. All the data in the column will be lost.
  - You are about to drop the column `recordedBy` on the `milk_records` table. All the data in the column will be lost.
  - You are about to drop the column `totalQuantity` on the `milk_records` table. All the data in the column will be lost.
  - You are about to drop the column `assignedTo` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `vet_visits` table. All the data in the column will be lost.
  - You are about to drop the column `prescriptions` on the `vet_visits` table. All the data in the column will be lost.
  - You are about to drop the column `reason` on the `vet_visits` table. All the data in the column will be lost.
  - You are about to drop the column `vetName` on the `vet_visits` table. All the data in the column will be lost.
  - You are about to drop the column `joiningDate` on the `workers` table. All the data in the column will be lost.
  - Added the required column `buyerName` to the `delivery_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `delivery_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryDate` to the `delivery_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricePerLiter` to the `delivery_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `farmId` to the `feeding_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `feedingTime` to the `feeding_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recordedById` to the `feeding_logs` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `feedType` on the `feeding_logs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `farmId` to the `milk_records` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `milk_records` table without a default value. This is not possible if the table is not empty.
  - Added the required column `session` to the `milk_records` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `veterinarian` to the `vet_visits` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visitDate` to the `vet_visits` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visitReason` to the `vet_visits` table without a default value. This is not possible if the table is not empty.
  - Added the required column `joinDate` to the `workers` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `role` on the `workers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MilkSession" AS ENUM ('MORNING', 'EVENING');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CARD', 'UPI', 'BANK_TRANSFER', 'CHEQUE');

-- CreateEnum
CREATE TYPE "WorkerRole" AS ENUM ('MANAGER', 'SUPERVISOR', 'MILKER', 'FEEDER', 'CLEANER', 'DRIVER', 'VETERINARIAN', 'OTHER');

-- CreateEnum
CREATE TYPE "WorkerShift" AS ENUM ('MORNING', 'EVENING', 'NIGHT', 'DAY', 'FULL_TIME');

-- CreateEnum
CREATE TYPE "FeedingTime" AS ENUM ('MORNING', 'AFTERNOON', 'EVENING');

-- CreateEnum
CREATE TYPE "FeedType" AS ENUM ('HAY', 'SILAGE', 'CONCENTRATE', 'GRAINS', 'MINERAL_SUPPLEMENTS', 'FRESH_GRASS');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'PARTIAL', 'OVERDUE');

-- CreateEnum
CREATE TYPE "VetVisitType" AS ENUM ('ROUTINE', 'EMERGENCY', 'FOLLOWUP', 'VACCINATION', 'CHECKUP');

-- CreateEnum
CREATE TYPE "TreatmentType" AS ENUM ('VACCINATION', 'MEDICATION', 'SURGERY', 'CHECKUP', 'DEWORMING', 'OTHER');

-- CreateEnum
CREATE TYPE "VetVisitStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "delivery_logs" DROP CONSTRAINT "delivery_logs_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "expenses" DROP CONSTRAINT "expenses_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "feeding_logs" DROP CONSTRAINT "feeding_logs_recordedBy_fkey";

-- DropForeignKey
ALTER TABLE "milk_records" DROP CONSTRAINT "milk_records_recordedBy_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_createdBy_fkey";

-- AlterTable
ALTER TABLE "animals" ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "delivery_logs" DROP COLUMN "createdBy",
DROP COLUMN "date",
DROP COLUMN "destination",
DROP COLUMN "invoiceNumber",
DROP COLUMN "price",
DROP COLUMN "status",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "buyerName" TEXT NOT NULL,
ADD COLUMN     "buyerPhone" TEXT,
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "deliveryDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "deliveryStatus" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "pricePerLiter" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "expenses" DROP COLUMN "createdBy",
DROP COLUMN "invoiceNumber",
DROP COLUMN "vendorName",
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "receiptNumber" TEXT,
ADD COLUMN     "vendor" TEXT,
DROP COLUMN "paymentMethod",
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'CASH';

-- AlterTable
ALTER TABLE "feeding_logs" DROP COLUMN "recordedBy",
DROP COLUMN "unit",
ADD COLUMN     "cost" DOUBLE PRECISION,
ADD COLUMN     "farmId" TEXT NOT NULL,
ADD COLUMN     "feedingTime" "FeedingTime" NOT NULL,
ADD COLUMN     "recordedById" TEXT NOT NULL,
DROP COLUMN "feedType",
ADD COLUMN     "feedType" "FeedType" NOT NULL;

-- AlterTable
ALTER TABLE "milk_records" DROP COLUMN "eveningQuantity",
DROP COLUMN "morningQuantity",
DROP COLUMN "recordedBy",
DROP COLUMN "totalQuantity",
ADD COLUMN     "farmId" TEXT NOT NULL,
ADD COLUMN     "fatContent" DOUBLE PRECISION,
ADD COLUMN     "quantity" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "session" "MilkSession" NOT NULL;

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "assignedTo",
DROP COLUMN "createdBy",
ADD COLUMN     "assignedToId" TEXT,
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "vet_visits" DROP COLUMN "date",
DROP COLUMN "prescriptions",
DROP COLUMN "reason",
DROP COLUMN "vetName",
ADD COLUMN     "prescription" TEXT,
ADD COLUMN     "treatmentType" "TreatmentType",
ADD COLUMN     "veterinarian" TEXT NOT NULL,
ADD COLUMN     "visitDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "visitReason" TEXT NOT NULL,
ADD COLUMN     "visitStatus" "VetVisitStatus" NOT NULL DEFAULT 'SCHEDULED',
ADD COLUMN     "visitType" "VetVisitType";

-- AlterTable
ALTER TABLE "workers" DROP COLUMN "joiningDate",
ADD COLUMN     "email" TEXT,
ADD COLUMN     "joinDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "shift" "WorkerShift" NOT NULL DEFAULT 'DAY',
DROP COLUMN "role",
ADD COLUMN     "role" "WorkerRole" NOT NULL;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feeding_logs" ADD CONSTRAINT "feeding_logs_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery_logs" ADD CONSTRAINT "delivery_logs_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
