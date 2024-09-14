import { Injectable } from "@nestjs/common";
import { ClientsRepository } from "../../repositories/clients-repository";
import { Either, left, right } from "@/core/either";
import { Address } from "../../../enterprise/entities/address";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ClientsAddressesRepository } from "../../repositories/clients-addresses-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { NotAllowedError } from "@/core/errors/not-allowed";

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
  ResourceNotFoundError | NotAllowedError,
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
      return left(new ResourceNotFoundError());
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
