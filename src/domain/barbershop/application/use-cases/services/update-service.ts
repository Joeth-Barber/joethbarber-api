import { Injectable } from "@nestjs/common";
import { ServicesRepository } from "../../repositories/services-repository";
import { Either, left, right } from "@/core/either";
import { Service } from "../../../enterprise/entities/service";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { NotAllowedError } from "@/core/errors/not-allowed";
import { BarbersRepository } from "../../repositories/barbers-repository";

interface UpdateServiceUseCaseRequest {
  serviceId: UniqueEntityId;
  barberId: UniqueEntityId;
  name?: string;
  price?: number;
}

type UpdateServiceUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { service: Service }
>;

@Injectable()
export class UpdateServiceUseCase {
  constructor(
    private servicesRepository: ServicesRepository,
    private barbersRepository: BarbersRepository
  ) {}

  async execute({
    serviceId,
    barberId,
    name,
    price,
  }: UpdateServiceUseCaseRequest): Promise<UpdateServiceUseCaseResponse> {
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

    if (name && service.name !== name) service.name = name;

    if (price && service.price !== price) service.price = price;

    await this.servicesRepository.save(service);

    return right({ service });
  }
}
