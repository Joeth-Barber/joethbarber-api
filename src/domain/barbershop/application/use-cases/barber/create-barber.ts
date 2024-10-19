import { Either, left, right } from "@/core/either";
import { EmailAlreadyExistsError } from "@/core/errors/email-already-exists";
import { Injectable } from "@nestjs/common";
import { Barber } from "../../../enterprise/entities/barber";
import { HashGenerator } from "../../cryptography/hash-generator";
import { BarbersRepository } from "../../repositories/barbers-repository";
import { Encrypter } from "../../cryptography/encrypter";

export interface CreateBarberUseCaseRequest {
  role: "ADMIN" | "EMPLOYEE";
  fullName: string;
  email: string;
  password: string;
}

type CreateBarberUseCaseResponse = Either<
  EmailAlreadyExistsError,
  { barber: Barber; accessToken: string }
>;

@Injectable()
export class CreateBarberUseCase {
  constructor(
    private barbersRepository: BarbersRepository,
    private hashGenerator: HashGenerator,
    private encrypter: Encrypter
  ) {}

  async execute({
    role,
    fullName,
    email,
    password,
  }: CreateBarberUseCaseRequest): Promise<CreateBarberUseCaseResponse> {
    const emailAlreadyExists = await this.barbersRepository.findByEmail(email);

    if (emailAlreadyExists) {
      return left(new EmailAlreadyExistsError());
    }

    const password_hash = await this.hashGenerator.hash(password);

    const barber = Barber.create({
      role,
      fullName,
      email,
      password: password_hash,
    });

    await this.barbersRepository.create(barber);

    const accessToken = await this.encrypter.encrypt({
      sub: barber.id.toString(),
      role: barber.role,
    });

    return right({
      barber,
      accessToken,
    });
  }
}
