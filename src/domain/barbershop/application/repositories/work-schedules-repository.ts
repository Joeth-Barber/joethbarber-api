import { WorkDay, WorkSchedule } from "../../enterprise/entities/work-schedule";

export abstract class WorkSchedulesRepository {
  abstract save(workSchedule: WorkSchedule): Promise<void>;
  abstract findById(id: string): Promise<WorkSchedule | null>;
  abstract findActive(): Promise<WorkSchedule | null>;
  abstract create(workSchedule: WorkSchedule): Promise<void>;
}
