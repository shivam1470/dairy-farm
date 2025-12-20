-- CreateEnum
CREATE TYPE "AnimalAcquisitionType" AS ENUM ('BORN', 'PURCHASED');

-- AlterTable
ALTER TABLE "animals" ADD COLUMN     "acquisitionType" "AnimalAcquisitionType" NOT NULL DEFAULT 'BORN',
ADD COLUMN     "purchaseFromEmail" TEXT,
ADD COLUMN     "purchaseFromMobile" TEXT,
ADD COLUMN     "purchaseFromName" TEXT,
ADD COLUMN     "timeOfBirth" TIMESTAMP(3);
