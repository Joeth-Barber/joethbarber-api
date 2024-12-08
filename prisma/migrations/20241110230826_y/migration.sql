/*
  Warnings:

  - Added the required column `date` to the `WorkDay` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WorkDay" ADD COLUMN     "date" TEXT NOT NULL;
