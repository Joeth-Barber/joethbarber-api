import { WorkDay } from "@/domain/barbershop/enterprise/entities/work-schedule";

export class AvailableDaysPresenter {
  static toHTTP(workScheduleId: string, workDays: WorkDay[]) {
    return {
      workScheduleId,
      workDays: workDays.map((workDay) => ({
        dayOfWeek: workDay.dayOfWeek,
        date: workDay.date,
        startTime: workDay.startTime,
        endTime: workDay.endTime,
        visible: workDay.visible,
        availableHours: workDay.availableHours,
        breaks: workDay.breaks?.map((breakItem) => ({
          title: breakItem.title,
          startTime: breakItem.startTime,
          endTime: breakItem.endTime,
        })),
      })),
    };
  }
}
