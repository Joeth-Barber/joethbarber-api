import { Injectable } from "@nestjs/common";
import { ServicesRepository } from "../../repositories/services-repository";
import { Either, left, right } from "@/core/either";
import { Service } from "../../../enterprise/entities/service";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface UpdateServiceUseCaseRequest {
  serviceId: UniqueEntityId;
  name: string;
  price: string;
}

type UpdateServiceUseCaseResponse = Either<
  ResourceNotFoundError,
  { service: Service }
>;

@Injectable()
export class UpdateServiceUseCase {
  constructor(private servicesRepository: ServicesRepository) {}

  async execute({
    serviceId,
    name,
    price,
  }: UpdateServiceUseCaseRequest): Promise<UpdateServiceUseCaseResponse> {
    const service = await this.servicesRepository.findById(
      serviceId.toString()
    );

    if (!service) {
      return left(new ResourceNotFoundError());
    }

    service.name = name;
    service.price = price;

    await this.servicesRepository.save(service);

    return right({ service });
  }
}
