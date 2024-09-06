import { Injectable } from "@nestjs/common";
import { ServicesRepository } from "../../repositories/services-repository";
import { Either, right } from "@/core/either";
import { Service } from "@/domain/barbershop/enterprise/entities/service";

export interface FetchServicesUseCaseRequest {
  page: number;
}

type FetchServicesUseCaseResponse = Either<null, { services: Service[] }>;

@Injectable()
export class FetchServicesUseCase {
  constructor(private servicesRepository: ServicesRepository) {}

  async execute({
    page,
  }: FetchServicesUseCaseRequest): Promise<FetchServicesUseCaseResponse> {
    const services = await this.servicesRepository.findMany({ page });

    return right({
      services,
    });
  }
}
