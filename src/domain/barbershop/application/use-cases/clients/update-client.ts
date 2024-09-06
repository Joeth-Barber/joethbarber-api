import { Injectable } from "@nestjs/common";
import { ClientsRepository } from "../../repositories/clients-repository";
import { Either, left, right } from "@/core/either";
import { Client } from "../../../enterprise/entities/client";
import { HashGenerator } from "../../cryptography/hash-generator";
import { EmailAlreadyExistsError } from "@/core/errors/email-already-exists";
import { CpfAlreadyExistsError } from "@/core/errors/cpf-already-exists";
import { PhoneAlreadyExistsError } from "@/core/errors/phone-already-exists";
import { ClientNotFoundError } from "@/core/errors/client-not-found";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

interface UpdateClientUseCaseRequest {
  clientId: UniqueEntityId;
  fullName: string;
  nickName: string;
  phone: string;
  email: string;
  password: string;
  billingDay: number;
}

type UpdateClientUseCaseResponse = Either<
  EmailAlreadyExistsError | PhoneAlreadyExistsError | CpfAlreadyExistsError,
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
    const phoneAlreadyExists = await this.clientsRepository.findByPhone(phone);

    if (phoneAlreadyExists) {
      return left(new PhoneAlreadyExistsError());
    }

    const emailAlreadyExists = await this.clientsRepository.findByEmail(email);

    if (emailAlreadyExists) {
      return left(new EmailAlreadyExistsError());
    }

    const client = await this.clientsRepository.findById(clientId.toString());

    if (!client) {
      return left(new ClientNotFoundError());
    }

    const password_hash = await this.hashGenerator.hash(password);

    client.fullName = fullName;
    client.nickName = nickName;
    client.phone = phone;
    client.email = email;
    client.password = password_hash;
    client.billingDay = billingDay;

    await this.clientsRepository.save(client);

    return right({ client });
  }
}
