import { Either, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { Service } from "../../../enterprise/entities/service";
import { ServicesRepository } from "../../repositories/services-repository";

export interface CreateServiceUseCaseRequest {
  name: string;
  price: string;
}

type CreateServiceUseCaseResponse = Either<null, { service: Service }>;

@Injectable()
export class CreateServiceUseCase {
  constructor(private servicesRepository: ServicesRepository) {}

  async execute({
    name,
    price,
  }: CreateServiceUseCaseRequest): Promise<CreateServiceUseCaseResponse> {
    const service = Service.create({
      name,
      price,
    });

    await this.servicesRepository.create(service);

    return right({
      service,
    });
  }
}
