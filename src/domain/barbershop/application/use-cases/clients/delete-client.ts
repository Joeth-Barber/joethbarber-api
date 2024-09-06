import { Injectable } from "@nestjs/common";
import { ClientsRepository } from "../../repositories/clients-repository";
import { Either, left, right } from "@/core/either";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ClientNotFoundError } from "@/core/errors/client-not-found";

interface DeleteClientUseCaseRequest {
  clientId: UniqueEntityId;
}

type DeleteClientUseCaseResponse = Either<ClientNotFoundError, {}>;

@Injectable()
export class DeleteClientUseCase {
  constructor(private clientsRepository: ClientsRepository) {}

  async execute({
    clientId,
  }: DeleteClientUseCaseRequest): Promise<DeleteClientUseCaseResponse> {
    const client = await this.clientsRepository.findById(clientId.toString());

    if (!client) {
      return left(new ClientNotFoundError());
    }

    await this.clientsRepository.delete(client);

    return right({});
  }
}
