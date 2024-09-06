import { Injectable } from "@nestjs/common";
import { ServicesRepository } from "../../repositories/services-repository";
import { Either, left, right } from "@/core/either";
import { Service } from "@/domain/barbershop/enterprise/entities/service";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

export interface FindServiceByIdUseCaseRequest {
  serviceId: UniqueEntityId;
}

type FindServiceByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  { service: Service }
>;

@Injectable()
export class FindServiceByIdUseCase {
  constructor(private servicesRepository: ServicesRepository) {}

  async execute({
    serviceId,
  }: FindServiceByIdUseCaseRequest): Promise<FindServiceByIdUseCaseResponse> {
    const service = await this.servicesRepository.findById(
      serviceId.toString()
    );

    if (!service) {
      return left(new ResourceNotFoundError());
    }

    return right({
      service,
    });
  }
}
