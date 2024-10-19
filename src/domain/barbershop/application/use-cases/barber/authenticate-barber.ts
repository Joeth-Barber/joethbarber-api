import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { WrongCredentialsError } from "@/core/errors/wrong-credentials";
import { HashComparer } from "../../cryptography/hash-comparer";
import { Encrypter } from "../../cryptography/encrypter";
import { BarbersRepository } from "../../repositories/barbers-repository";

interface AuthenticateBarberUseCaseRequest {
  email: string;
  password: string;
}

type AuthenticateBarberUseCaseResponse = Either<
  WrongCredentialsError,
  { accessToken: string }
>;

@Injectable()
export class AuthenticateBarberUseCase {
  constructor(
    private barbersRepository: BarbersRepository,
    private hashCompare: HashComparer,
    private encrypter: Encrypter
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateBarberUseCaseRequest): Promise<AuthenticateBarberUseCaseResponse> {
    const barber = await this.barbersRepository.findByEmail(email);

    if (!barber) {
      return left(new WrongCredentialsError());
    }

    const isPasswordValid = await this.hashCompare.compare(
      password,
      barber.password
    );

    if (!isPasswordValid) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: barber.id.toString(),
      role: barber.role,
    });

    return right({ accessToken });
  }
}
