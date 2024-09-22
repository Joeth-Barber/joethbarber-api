import { Injectable } from "@nestjs/common";
import { ServicesRepository } from "../../repositories/services-repository";
import { Either, left, right } from "@/core/either";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { BarbersRepository } from "../../repositories/barbers-repository";
import { NotAllowedError } from "@/core/errors/not-allowed";

interface DeleteServiceUseCaseRequest {
  serviceId: UniqueEntityId;
  barberId: UniqueEntityId;
}

type DeleteServiceUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>;

@Injectable()
export class DeleteServiceUseCase {
  constructor(
    private servicesRepository: ServicesRepository,
    private barbersRepository: BarbersRepository
  ) {}

  async execute({
    serviceId,
    barberId,
  }: DeleteServiceUseCaseRequest): Promise<DeleteServiceUseCaseResponse> {
    const barber = await this.barbersRepository.findById(barberId.toString());

    if (!barber) {
      return left(new ResourceNotFoundError());
    }

    if (barber.role !== "ADMIN") {
      return left(new NotAllowedError());
    }

    const service = await this.servicesRepository.findById(
      serviceId.toString()
    );

    if (!service) {
      return left(new ResourceNotFoundError());
    }

    await this.servicesRepository.delete(service);

    return right({});
  }
}
