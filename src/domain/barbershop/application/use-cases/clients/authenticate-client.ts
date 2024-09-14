import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { WrongCredentialsError } from "@/core/errors/wrong-credentials";
import { ClientsRepository } from "../../repositories/clients-repository";
import { HashComparer } from "../../cryptography/hash-comparer";
import { Encrypter } from "../../cryptography/encrypter";

interface AuthenticateClientUseCaseRequest {
  email: string;
  password: string;
}

type AuthenticateClientUseCaseResponse = Either<
  WrongCredentialsError,
  { accessToken: string }
>;

@Injectable()
export class AuthenticateClientUseCase {
  constructor(
    private clientsRepository: ClientsRepository,
    private hashCompare: HashComparer,
    private encrypter: Encrypter
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateClientUseCaseRequest): Promise<AuthenticateClientUseCaseResponse> {
    const client = await this.clientsRepository.findByEmail(email);

    if (!client) {
      return left(new WrongCredentialsError());
    }

    const isPasswordValid = await this.hashCompare.compare(
      password,
      client.password
    );

    if (!isPasswordValid) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: client.id.toString(),
      role: client.role,
    });

    return right({ accessToken });
  }
}
