import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { WorkSchedulesRepository } from "../../repositories/work-schedules-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { NotAllowedError } from "@/core/errors/not-allowed";
import { BarbersRepository } from "../../repositories/barbers-repository";

export interface ToggleWorkScheduleStatusUseCaseRequest {
  workScheduleId: UniqueEntityId;
  barberId: UniqueEntityId;
  allowClients?: boolean; // Usado para liberar clientes avulsos
}

type ToggleWorkScheduleStatusUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>;

@Injectable()
export class ToggleWorkScheduleStatusUseCase {
  constructor(
    private workSchedulesRepository: WorkSchedulesRepository,
    private barbersRepository: BarbersRepository
  ) {}

  async execute({
    workScheduleId,
    barberId,
    allowClients,
  }: ToggleWorkScheduleStatusUseCaseRequest): Promise<ToggleWorkScheduleStatusUseCaseResponse> {
    const barber = await this.barbersRepository.findById(barberId.toString());

    if (!barber) {
      return left(new ResourceNotFoundError());
    }

    const workSchedule = await this.workSchedulesRepository.findById(
      workScheduleId.toString()
    );

    if (!workSchedule) {
      return left(new ResourceNotFoundError());
    }

    if (barber.id.toString() !== workSchedule.barberId.toString()) {
      return left(new NotAllowedError());
    }

    if (allowClients !== undefined) {
      workSchedule.allowClientsToView = allowClients;
    } else {
      workSchedule.status =
        workSchedule.status === "ACTIVE" ? "DISABLED" : "ACTIVE";
    }

    await this.workSchedulesRepository.save(workSchedule);

    return right({});
  }
}
