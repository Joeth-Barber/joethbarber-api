-- AlterTable
ALTER TABLE "WorkDay" ADD COLUMN     "availableHours" TEXT[],
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT false;
