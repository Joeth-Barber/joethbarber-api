import { Injectable } from "@nestjs/common";
import { ClientsRepository } from "../../repositories/clients-repository";
import { Either, left, right } from "@/core/either";
import { Client } from "@/domain/barbershop/enterprise/entities/client";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ClientNotFoundError } from "@/core/errors/client-not-found";

export interface FindClientByIdUseCaseRequest {
  clientId: UniqueEntityId;
}

type FindClientByIdUseCaseResponse = Either<
  ClientNotFoundError,
  { client: Client }
>;

@Injectable()
export class FindClientByIdUseCase {
  constructor(private clientsRepository: ClientsRepository) {}

  async execute({
    clientId,
  }: FindClientByIdUseCaseRequest): Promise<FindClientByIdUseCaseResponse> {
    const client = await this.clientsRepository.findById(clientId.toString());

    if (!client) {
      return left(new ClientNotFoundError());
    }

    return right({
      client,
    });
  }
}
