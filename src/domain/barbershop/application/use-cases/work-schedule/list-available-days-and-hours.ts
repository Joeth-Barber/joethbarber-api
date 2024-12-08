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
  { availableDaysAndHours: WorkDay[] }
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

    const isMensalist = client.role === "MENSALIST";
    let availableDaysAndHours: WorkDay[] = [];

    if (workSchedule.status === "ACTIVE") {
      availableDaysAndHours = workSchedule.workDays.map((workDay) => ({
        ...workDay,
        visible: isMensalist || workSchedule.allowClientsToView,
      }));
    }

    return right({ availableDaysAndHours });
  }
}
