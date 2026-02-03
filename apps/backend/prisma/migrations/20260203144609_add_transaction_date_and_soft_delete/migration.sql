/*
  Warnings:

  - Added the required column `transactionDate` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "payments_date_idx";

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "transactionDate" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "payments_transactionDate_idx" ON "payments"("transactionDate");

-- CreateIndex
CREATE INDEX "payments_isDeleted_idx" ON "payments"("isDeleted");
