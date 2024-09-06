import { Injectable } from "@nestjs/common";
import { BarbersRepository } from "../../repositories/barbers-repository";
import { Either, left, right } from "@/core/either";
import { Barber } from "@/domain/barbershop/enterprise/entities/barber";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

export interface FindBarberByIdUseCaseRequest {
  barberId: UniqueEntityId;
}

type FindBarberByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  { barber: Barber }
>;

@Injectable()
export class FindBarberByIdUseCase {
  constructor(private barbersRepository: BarbersRepository) {}

  async execute({
    barberId,
  }: FindBarberByIdUseCaseRequest): Promise<FindBarberByIdUseCaseResponse> {
    const barber = await this.barbersRepository.findById(barberId.toString());

    if (!barber) {
      return left(new ResourceNotFoundError());
    }

    return right({
      barber,
    });
  }
}
