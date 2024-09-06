import { Injectable } from "@nestjs/common";
import { ClientsRepository } from "../../repositories/clients-repository";
import { Either, right } from "@/core/either";
import { Client } from "@/domain/barbershop/enterprise/entities/client";

export interface FetchClientsUseCaseRequest {
  page: number;
}

type FetchClientsUseCaseResponse = Either<null, { clients: Client[] }>;

@Injectable()
export class FetchClientsUseCase {
  constructor(private clientsRepository: ClientsRepository) {}

  async execute({
    page,
  }: FetchClientsUseCaseRequest): Promise<FetchClientsUseCaseResponse> {
    const clients = await this.clientsRepository.findMany({ page });

    return right({
      clients,
    });
  }
}
