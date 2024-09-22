import { Injectable } from "@nestjs/common";
import { ClientsRepository } from "../../repositories/clients-repository";
import { Either, left, right } from "@/core/either";
import { Client } from "../../../enterprise/entities/client";
import { CPF } from "../../../enterprise/entities/value-objects/cpf";
import { HashGenerator } from "../../cryptography/hash-generator";
import { EmailAlreadyExistsError } from "@/core/errors/email-already-exists";
import { CpfAlreadyExistsError } from "@/core/errors/cpf-already-exists";
import { PhoneAlreadyExistsError } from "@/core/errors/phone-already-exists";
import { Encrypter } from "../../cryptography/encrypter";

interface CreateClientUseCaseRequest {
  fullName: string;
  nickName: string;
  phone: string;
  cpf: CPF;
  email: string;
  password: string;
  billingDay: number;
}

type CreateClientUseCaseResponse = Either<
  EmailAlreadyExistsError | PhoneAlreadyExistsError | CpfAlreadyExistsError,
  { client: Client; accessToken: string }
>;

@Injectable()
export class CreateClientUseCase {
  constructor(
    private clientsRepository: ClientsRepository,
    private hashGenerator: HashGenerator,
    private encrypter: Encrypter
  ) {}

  async execute({
    fullName,
    nickName,
    phone,
    cpf,
    email,
    password,
    billingDay,
  }: CreateClientUseCaseRequest): Promise<CreateClientUseCaseResponse> {
    const phoneAlreadyExists = await this.clientsRepository.findByPhone(phone);

    if (phoneAlreadyExists) {
      return left(new PhoneAlreadyExistsError());
    }

    const cpfAlreadyExists = await this.clientsRepository.findByCpf(cpf.value);

    if (cpfAlreadyExists) {
      return left(new CpfAlreadyExistsError());
    }

    const emailAlreadyExists = await this.clientsRepository.findByEmail(email);

    if (emailAlreadyExists) {
      return left(new EmailAlreadyExistsError());
    }

    const password_hash = await this.hashGenerator.hash(password);

    const client = Client.create({
      fullName,
      nickName,
      phone,
      cpf,
      email,
      password: password_hash,
      billingDay,
    });

    await this.clientsRepository.create(client);

    const accessToken = await this.encrypter.encrypt({
      sub: client.id.toString(),
      role: client.role,
    });

    return right({ client, accessToken });
  }
}
