-- DropForeignKey
ALTER TABLE "Break" DROP CONSTRAINT "Break_workDayId_fkey";

-- DropForeignKey
ALTER TABLE "WorkDay" DROP CONSTRAINT "WorkDay_workScheduleId_fkey";

-- AddForeignKey
ALTER TABLE "WorkDay" ADD CONSTRAINT "WorkDay_workScheduleId_fkey" FOREIGN KEY ("workScheduleId") REFERENCES "WorkSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Break" ADD CONSTRAINT "Break_workDayId_fkey" FOREIGN KEY ("workDayId") REFERENCES "WorkDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;
