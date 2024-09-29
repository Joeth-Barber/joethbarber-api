import { Injectable } from "@nestjs/common";
import { ClientsRepository } from "../../repositories/clients-repository";
import { Either, left, right } from "@/core/either";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { NotAllowedError } from "@/core/errors/not-allowed";

interface ToggleClientRoleRequest {
  clientId: UniqueEntityId;
}

type ToggleClientRoleResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>;

@Injectable()
export class ToggleClientRole {
  constructor(private clientsRepository: ClientsRepository) {}

  async execute({
    clientId,
  }: ToggleClientRoleRequest): Promise<ToggleClientRoleResponse> {
    const client = await this.clientsRepository.findById(clientId.toString());

    if (!client) {
      return left(new ResourceNotFoundError());
    }

    if (client.role === "CLIENT") {
      client.role = "MENSALIST";
    } else {
      client.role = "CLIENT";
    }

    await this.clientsRepository.save(client);

    return right({});
  }
}
