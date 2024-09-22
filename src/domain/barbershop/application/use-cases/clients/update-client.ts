import { Injectable } from "@nestjs/common";
import { ClientsRepository } from "../../repositories/clients-repository";
import { Either, left, right } from "@/core/either";
import { Client } from "../../../enterprise/entities/client";
import { HashGenerator } from "../../cryptography/hash-generator";
import { EmailAlreadyExistsError } from "@/core/errors/email-already-exists";
import { CpfAlreadyExistsError } from "@/core/errors/cpf-already-exists";
import { PhoneAlreadyExistsError } from "@/core/errors/phone-already-exists";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { NotAllowedError } from "@/core/errors/not-allowed";

interface UpdateClientUseCaseRequest {
  clientId: UniqueEntityId;
  fullName?: string;
  nickName?: string;
  phone?: string;
  email?: string;
  password?: string;
  billingDay?: number;
}

type UpdateClientUseCaseResponse = Either<
  | ResourceNotFoundError
  | EmailAlreadyExistsError
  | PhoneAlreadyExistsError
  | CpfAlreadyExistsError
  | NotAllowedError,
  { client: Client }
>;

@Injectable()
export class UpdateClientUseCase {
  constructor(
    private clientsRepository: ClientsRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    clientId,
    fullName,
    nickName,
    phone,
    email,
    password,
    billingDay,
  }: UpdateClientUseCaseRequest): Promise<UpdateClientUseCaseResponse> {
    const client = await this.clientsRepository.findById(clientId.toString());

    if (!client) {
      return left(new ResourceNotFoundError());
    }

    if (client.id.toString() !== clientId.toString()) {
      return left(new NotAllowedError());
    }

    if (phone && phone !== client.phone) {
      const phoneAlreadyExists = await this.clientsRepository.findByPhone(
        phone
      );
      if (phoneAlreadyExists) {
        return left(new PhoneAlreadyExistsError());
      }
      client.phone = phone;
    }

    if (email && email !== client.email) {
      const emailAlreadyExists = await this.clientsRepository.findByEmail(
        email
      );
      if (emailAlreadyExists) {
        return left(new EmailAlreadyExistsError());
      }
      client.email = email;
    }

    if (fullName && client.fullName !== fullName) client.fullName = fullName;

    if (nickName && client.nickName !== nickName) client.nickName = nickName;

    if (billingDay && client.billingDay !== billingDay)
      client.billingDay = billingDay;

    if (password) {
      const password_hash = await this.hashGenerator.hash(password);
      client.password = password_hash;
    }

    await this.clientsRepository.save(client);

    return right({ client });
  }
}
