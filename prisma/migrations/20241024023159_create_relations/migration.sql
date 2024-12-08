/*
  Warnings:

  - You are about to drop the column `products` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `services` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `bookings` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `products` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `workDays` on the `WorkSchedule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "products",
DROP COLUMN "services";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "bookings",
DROP COLUMN "products";

-- AlterTable
ALTER TABLE "WorkSchedule" DROP COLUMN "workDays";

-- CreateTable
CREATE TABLE "WorkDay" (
    "id" TEXT NOT NULL,
    "workScheduleId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,

    CONSTRAINT "WorkDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Break" (
    "id" TEXT NOT NULL,
    "workDayId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,

    CONSTRAINT "Break_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BookingServices" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_BookingProducts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PaymentBookings" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PaymentProducts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BookingServices_AB_unique" ON "_BookingServices"("A", "B");

-- CreateIndex
CREATE INDEX "_BookingServices_B_index" ON "_BookingServices"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BookingProducts_AB_unique" ON "_BookingProducts"("A", "B");

-- CreateIndex
CREATE INDEX "_BookingProducts_B_index" ON "_BookingProducts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PaymentBookings_AB_unique" ON "_PaymentBookings"("A", "B");

-- CreateIndex
CREATE INDEX "_PaymentBookings_B_index" ON "_PaymentBookings"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PaymentProducts_AB_unique" ON "_PaymentProducts"("A", "B");

-- CreateIndex
CREATE INDEX "_PaymentProducts_B_index" ON "_PaymentProducts"("B");

-- AddForeignKey
ALTER TABLE "WorkDay" ADD CONSTRAINT "WorkDay_workScheduleId_fkey" FOREIGN KEY ("workScheduleId") REFERENCES "WorkSchedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Break" ADD CONSTRAINT "Break_workDayId_fkey" FOREIGN KEY ("workDayId") REFERENCES "WorkDay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookingServices" ADD CONSTRAINT "_BookingServices_A_fkey" FOREIGN KEY ("A") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookingServices" ADD CONSTRAINT "_BookingServices_B_fkey" FOREIGN KEY ("B") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookingProducts" ADD CONSTRAINT "_BookingProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookingProducts" ADD CONSTRAINT "_BookingProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PaymentBookings" ADD CONSTRAINT "_PaymentBookings_A_fkey" FOREIGN KEY ("A") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PaymentBookings" ADD CONSTRAINT "_PaymentBookings_B_fkey" FOREIGN KEY ("B") REFERENCES "Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PaymentProducts" ADD CONSTRAINT "_PaymentProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PaymentProducts" ADD CONSTRAINT "_PaymentProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
