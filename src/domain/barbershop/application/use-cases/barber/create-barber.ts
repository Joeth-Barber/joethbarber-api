import { Either, left, right } from "@/core/either";
import { EmailAlreadyExistsError } from "@/core/errors/email-already-exists";
import { Injectable } from "@nestjs/common";
import { Barber } from "../../../enterprise/entities/barber";
import { HashGenerator } from "../../cryptography/hash-generator";
import { BarbersRepository } from "../../repositories/barbers-repository";

export interface CreateBarberUseCaseRequest {
  fullName: string;
  email: string;
  password: string;
}

type CreateBarberUseCaseResponse = Either<
  EmailAlreadyExistsError,
  { barber: Barber }
>;

@Injectable()
export class CreateBarberUseCase {
  constructor(
    private barbersRepository: BarbersRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
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
      fullName,
      email,
      password: password_hash,
      role: "ADMIN",
    });

    await this.barbersRepository.create(barber);

    return right({
      barber,
    });
  }
}
