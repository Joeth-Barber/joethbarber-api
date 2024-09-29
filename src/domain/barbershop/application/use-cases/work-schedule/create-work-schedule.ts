import { Either, left, right } from "@/core/either";
import {
  WorkDay,
  WorkSchedule,
} from "@/domain/barbershop/enterprise/entities/work-schedule";
import { Injectable } from "@nestjs/common";
import { WorkSchedulesRepository } from "../../repositories/work-schedules-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { populateAvailableHours } from "@/utils/work-schedule.utils";
import { BarbersRepository } from "../../repositories/barbers-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { NotAllowedError } from "@/core/errors/not-allowed";

export interface CreateWorkScheduleUseCaseRequest {
  barberId: UniqueEntityId;
  workDays: WorkDay[];
}

type CreateWorkScheduleUseCaseResponse = Either<
  ResourceNotFoundError,
  { workSchedule: WorkSchedule }
>;

@Injectable()
export class CreateWorkScheduleUseCase {
  constructor(
    private workSchedulesRepository: WorkSchedulesRepository,
    private barbersRepository: BarbersRepository
  ) {}

  async execute({
    barberId,
    workDays,
  }: CreateWorkScheduleUseCaseRequest): Promise<CreateWorkScheduleUseCaseResponse> {
    const barber = await this.barbersRepository.findById(barberId.toString());

    if (!barber) {
      return left(new ResourceNotFoundError());
    }

    if (barber.role !== "ADMIN") {
      return left(new NotAllowedError());
    }

    const workDaysWithAvailableHours = populateAvailableHours(workDays);

    const workSchedule = WorkSchedule.create({
      barberId,
      workDays: workDaysWithAvailableHours,
    });

    await this.workSchedulesRepository.create(workSchedule);

    return right({
      workSchedule,
    });
  }
}
