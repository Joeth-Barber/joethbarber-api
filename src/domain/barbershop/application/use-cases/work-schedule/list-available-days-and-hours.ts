import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { WorkSchedulesRepository } from "../../repositories/work-schedules-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { WorkDay } from "@/domain/barbershop/enterprise/entities/work-schedule";

export interface FetchAvailableDaysAndHoursUseCaseRequest {
  workScheduleId: UniqueEntityId;
}

type FetchAvailableDaysAndHoursUseCaseResponse = Either<
  ResourceNotFoundError,
  { availableDaysAndItHours: WorkDay[] }
>;

@Injectable()
export class FetchAvailableDaysAndHoursUseCase {
  constructor(private workSchedulesRepository: WorkSchedulesRepository) {}

  async execute({
    workScheduleId,
  }: FetchAvailableDaysAndHoursUseCaseRequest): Promise<FetchAvailableDaysAndHoursUseCaseResponse> {
    const workSchedule = await this.workSchedulesRepository.findById(
      workScheduleId.toString()
    );

    if (!workSchedule) {
      return left(new ResourceNotFoundError());
    }

    const availableDaysAndItHours = workSchedule.workDays.map(
      (workDay) => workDay
    );

    if (!availableDaysAndItHours) {
      return left(new ResourceNotFoundError());
    }

    return right({
      availableDaysAndItHours,
    });
  }
}
