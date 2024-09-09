import { WorkSchedulesRepository } from "@/domain/barbershop/application/repositories/work-schedules-repository";
import { WorkSchedule } from "@/domain/barbershop/enterprise/entities/work-schedule";
import { populateAvailableHours } from "@/utils/work-schedule.utils";

export class InMemoryWorkSchedulesRepository
  implements WorkSchedulesRepository
{
  public items: WorkSchedule[] = [];

  async save(WorkSchedule: WorkSchedule) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === WorkSchedule.id
    );

    this.items[itemIndex] = WorkSchedule;
  }

  async findById(id: string) {
    const WorkSchedule = this.items.find((item) => item.id.toString() === id);

    if (!WorkSchedule) {
      return null;
    }

    return WorkSchedule;
  }

  async create(workSchedule: WorkSchedule) {
    const workDaysWithAvailableHours = populateAvailableHours(
      workSchedule.workDays
    );
    workSchedule.workDays = workDaysWithAvailableHours;

    this.items.push(workSchedule);
  }
}
