import { WorkSchedule } from "@/domain/barbershop/enterprise/entities/work-schedule";
import { format } from "date-fns";

export class WorkSchedulePresenter {
  static toHTTP(workSchedule: WorkSchedule) {
    return {
      id: workSchedule.id.toString(),
      barberId: workSchedule.barberId.toString(),
      status: workSchedule.status,
      allowClientsToView: workSchedule.allowClientsToView,
      activatedAt: format(workSchedule.activatedAt, "dd/MM/yyyy"),
      workDays: workSchedule.workDays.map((workDay) => ({
        dayOfWeek: workDay.dayOfWeek,
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
      // createdAt: format(workSchedule.createdAt, "dd/MM/yyyy"),
      // updatedAt: workSchedule.updatedAt,
    };
  }
}
