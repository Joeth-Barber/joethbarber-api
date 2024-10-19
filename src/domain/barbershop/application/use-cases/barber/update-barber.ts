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
  role?: "ADMIN" | "EMPLOYEE";
  fullName?: string;
  email?: string;
  password?: string;
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
    role,
    fullName,
    email,
    password,
  }: UpdateBarberUseCaseRequest): Promise<UpdateBarberUseCaseResponse> {
    const barber = await this.barbersRepository.findById(barberId.toString());

    if (!barber) {
      return left(new ResourceNotFoundError());
    }

    if (email && email !== barber.email) {
      const emailAlreadyExists = await this.barbersRepository.findByEmail(
        email
      );
      if (emailAlreadyExists) {
        return left(new EmailAlreadyExistsError());
      }
      barber.email = email;
    }

    if (role && barber.role !== role) barber.role = role;

    if (fullName && barber.fullName !== fullName) barber.fullName = fullName;

    if (password) {
      const password_hash = await this.hashGenerator.hash(password);
      barber.password = password_hash;
    }

    await this.barbersRepository.save(barber);

    return right({ barber });
  }
}
