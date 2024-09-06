import { Injectable } from "@nestjs/common";
import { ClientsRepository } from "../repositories/clients-repository";
import { Either, left, right } from "@/core/either";
import { Address } from "../../enterprise/entities/address";
import { ClientNotFoundError } from "@/core/errors/client-not-found";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ClientsAddressesRepository } from "../repositories/clients-addresses-repository";

interface CreateClientAddressUseCaseRequest {
  clientId: UniqueEntityId;
  zipCode: string;
  state: string;
  city: string;
  neighborhood: string;
  address: string;
  number: string;
}

type CreateClientAddressUseCaseResponse = Either<
  ClientNotFoundError,
  { clientAddress: Address }
>;

@Injectable()
export class CreateClientAddressUseCase {
  constructor(
    private clientsRepository: ClientsRepository,
    private clientsAddressesRepository: ClientsAddressesRepository
  ) {}

  async execute({
    clientId,
    zipCode,
    state,
    city,
    neighborhood,
    address,
    number,
  }: CreateClientAddressUseCaseRequest): Promise<CreateClientAddressUseCaseResponse> {
    const client = await this.clientsRepository.findById(clientId.toString());

    if (!client) {
      return left(new ClientNotFoundError());
    }

    const clientAddress = Address.create({
      clientId,
      zipCode,
      state,
      city,
      neighborhood,
      address,
      number,
    });

    await this.clientsAddressesRepository.create(clientAddress);

    return right({
      clientAddress,
    });
  }
}
