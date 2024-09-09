import { Either, right } from "@/core/either";
import {
  WorkDay,
  WorkSchedule,
} from "@/domain/barbershop/enterprise/entities/work-schedule";
import { Injectable } from "@nestjs/common";
import { WorkSchedulesRepository } from "../../repositories/work-schedules-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { populateAvailableHours } from "@/utils/work-schedule.utils";

export interface CreateWorkScheduleUseCaseRequest {
  barberId: UniqueEntityId;
  workDays: WorkDay[];
  status: "ACTIVE" | "DISABLED";
}

type CreateWorkScheduleUseCaseResponse = Either<
  null,
  { workSchedule: WorkSchedule }
>;

@Injectable()
export class CreateWorkScheduleUseCase {
  constructor(private workSchedulesRepository: WorkSchedulesRepository) {}

  async execute({
    barberId,
    workDays,
    status,
  }: CreateWorkScheduleUseCaseRequest): Promise<CreateWorkScheduleUseCaseResponse> {
    const workDaysWithAvailableHours = populateAvailableHours(workDays);

    const workSchedule = WorkSchedule.create({
      barberId,
      workDays: workDaysWithAvailableHours,
      status,
    });

    await this.workSchedulesRepository.create(workSchedule);

    return right({
      workSchedule,
    });
  }
}
