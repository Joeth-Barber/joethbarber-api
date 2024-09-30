import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { WorkSchedulesRepository } from "../../repositories/work-schedules-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { WorkDay } from "@/domain/barbershop/enterprise/entities/work-schedule";
import { ClientsRepository } from "../../repositories/clients-repository";

export interface FetchAvailableDaysAndHoursUseCaseRequest {
  workScheduleId: UniqueEntityId;
  clientId: UniqueEntityId;
}

type FetchAvailableDaysAndHoursUseCaseResponse = Either<
  ResourceNotFoundError,
  { availableDaysAndItHours: WorkDay[] }
>;

@Injectable()
export class FetchAvailableDaysAndHoursUseCase {
  constructor(
    private workSchedulesRepository: WorkSchedulesRepository,
    private clientsRepository: ClientsRepository
  ) {}

  async execute({
    workScheduleId,
    clientId,
  }: FetchAvailableDaysAndHoursUseCaseRequest): Promise<FetchAvailableDaysAndHoursUseCaseResponse> {
    const workSchedule = await this.workSchedulesRepository.findById(
      workScheduleId.toString()
    );

    if (!workSchedule) {
      return left(new ResourceNotFoundError());
    }

    const client = await this.clientsRepository.findById(clientId.toString());

    if (!client) {
      return left(new ResourceNotFoundError());
    }

    const availableDaysAndItHours = workSchedule.workDays.map(
      (workDay) => workDay
    );

    if (!availableDaysAndItHours) {
      return left(new ResourceNotFoundError());
    }

    //TODO: colocar essa variavel numa configuração remota;
    const aDayInMilliseconds = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    let isAfter24Hours =
      workSchedule.activatedAt.getTime() - new Date().getTime() >=
      aDayInMilliseconds;

    console.log(
      "@@@@ activatedAt validated : " + workSchedule.activatedAt.getTime()
    );
    console.log("@@@ isAfter24Hours: " + isAfter24Hours);

    if (client.role === "MENSALIST" && workSchedule.status === "ACTIVE") {
      return right({
        availableDaysAndItHours,
      });
    } else if (
      client.role === "MENSALIST" &&
      workSchedule.status === "DISABLED"
    ) {
      const availableDaysAndItHours = this.setWorkDaysStatusToFalse(
        workSchedule.workDays
      );

      return right({
        availableDaysAndItHours,
      });
    } else if (
      client.role === "CLIENT" &&
      workSchedule.status === "ACTIVE" &&
      isAfter24Hours
    ) {
      return right({
        availableDaysAndItHours,
      });
    } else if (
      client.role === "CLIENT" &&
      workSchedule.status === "ACTIVE" &&
      !isAfter24Hours
    ) {
      const availableDaysAndItHours = this.setWorkDaysStatusToFalse(
        workSchedule.workDays
      );

      return right({
        availableDaysAndItHours,
      });
    } else if (client.role === "CLIENT" && workSchedule.status === "DISABLED") {
      const availableDaysAndItHours = this.setWorkDaysStatusToFalse(
        workSchedule.workDays
      );

      return right({
        availableDaysAndItHours,
      });
    }

    return right({
      availableDaysAndItHours,
    });
  }

  public setWorkDaysStatusToFalse(workDays: WorkDay[]): WorkDay[] {
    return workDays.map((workDay) => {
      workDay.status = false;
      return workDay;
    });
  }
}
