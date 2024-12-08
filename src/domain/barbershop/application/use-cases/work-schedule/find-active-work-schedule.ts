import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { WorkSchedulesRepository } from "../../repositories/work-schedules-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { WorkDay } from "@/domain/barbershop/enterprise/entities/work-schedule";
import { ClientsRepository } from "../../repositories/clients-repository";

export interface FindActiveWorkScheduleRequest {
  clientId: UniqueEntityId;
}

type FindActiveWorkScheduleResponse = Either<
  ResourceNotFoundError,
  { workScheduleId: string; availableDaysAndHours: WorkDay[] }
>;

@Injectable()
export class FindActiveWorkScheduleUseCase {
  constructor(
    private workSchedulesRepository: WorkSchedulesRepository,
    private clientsRepository: ClientsRepository
  ) {}

  async execute({
    clientId,
  }: FindActiveWorkScheduleRequest): Promise<FindActiveWorkScheduleResponse> {
    const client = await this.clientsRepository.findById(clientId.toString());

    if (!client) {
      return left(new ResourceNotFoundError());
    }

    const isMensalist = client.role === "MENSALIST";

    const workSchedule = await this.workSchedulesRepository.findActive();

    if (!workSchedule) {
      return left(new ResourceNotFoundError());
    }

    const availableDaysAndHours = workSchedule.workDays.map((workDay) => ({
      ...workDay,
      visible: isMensalist || workSchedule.allowClientsToView,
    }));

    return right({
      workScheduleId: workSchedule.id.toString(),
      availableDaysAndHours,
    });
  }
}
