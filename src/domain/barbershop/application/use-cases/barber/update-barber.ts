import { Injectable } from "@nestjs/common";
import { BarbersRepository } from "../../repositories/barbers-repository";
import { Either, left, right } from "@/core/either";
import { Barber } from "../../../enterprise/entities/barber";
import { HashGenerator } from "../../cryptography/hash-generator";
import { EmailAlreadyExistsError } from "@/core/errors/email-already-exists";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface UpdateBarberUseCaseRequest {
  barberId: UniqueEntityId;
  fullName: string;
  email: string;
  password: string;
}

type UpdateBarberUseCaseResponse = Either<
  ResourceNotFoundError | EmailAlreadyExistsError,
  { barber: Barber }
>;

@Injectable()
export class UpdateBarberUseCase {
  constructor(
    private barbersRepository: BarbersRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    barberId,
    fullName,
    email,
    password,
  }: UpdateBarberUseCaseRequest): Promise<UpdateBarberUseCaseResponse> {
    const emailAlreadyExists = await this.barbersRepository.findByEmail(email);

    if (emailAlreadyExists) {
      return left(new EmailAlreadyExistsError());
    }

    const barber = await this.barbersRepository.findById(barberId.toString());

    if (!barber) {
      return left(new ResourceNotFoundError());
    }

    const password_hash = await this.hashGenerator.hash(password);

    barber.fullName = fullName;
    barber.email = email;
    barber.password = password_hash;

    await this.barbersRepository.save(barber);

    return right({ barber });
  }
}
