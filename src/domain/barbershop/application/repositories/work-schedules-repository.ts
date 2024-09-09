import { WorkSchedule } from "../../enterprise/entities/work-schedule";

export abstract class WorkSchedulesRepository {
  abstract save(workSchedule: WorkSchedule): Promise<void>;
  abstract findById(id: string): Promise<WorkSchedule | null>;
  abstract create(workSchedule: WorkSchedule): Promise<void>;
}
