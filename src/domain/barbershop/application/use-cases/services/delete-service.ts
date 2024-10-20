import { Injectable } from "@nestjs/common";
import { ServicesRepository } from "../../repositories/services-repository";
import { Either, left, right } from "@/core/either";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { NotAllowedError } from "@/core/errors/not-allowed";

interface DeleteServiceUseCaseRequest {
  serviceId: UniqueEntityId;
}

type DeleteServiceUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>;

@Injectable()
export class DeleteServiceUseCase {
  constructor(private servicesRepository: ServicesRepository) {}

  async execute({
    serviceId,
  }: DeleteServiceUseCaseRequest): Promise<DeleteServiceUseCaseResponse> {
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
