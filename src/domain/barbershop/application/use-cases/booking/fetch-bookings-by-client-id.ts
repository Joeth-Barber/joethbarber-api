import { Injectable } from "@nestjs/common";
import { BookingsRepository } from "../../repositories/bookings-repository";
import { Either, left, right } from "@/core/either";
import { Booking } from "@/domain/barbershop/enterprise/entities/booking";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ClientsRepository } from "../../repositories/clients-repository";

export interface FetchClientBookingsUseCaseRequest {
  clientId: UniqueEntityId;
  page: number;
}

type FetchClientBookingsUseCaseResponse = Either<
  ResourceNotFoundError,
  { bookings: Booking[] }
>;

@Injectable()
export class FetchClientBookingsUseCase {
  constructor(
    private bookingsRepository: BookingsRepository,
    private clientsRepository: ClientsRepository
  ) {}

  async execute({
    clientId,
    page,
  }: FetchClientBookingsUseCaseRequest): Promise<FetchClientBookingsUseCaseResponse> {
    const client = await this.clientsRepository.findById(clientId.toString());

    if (!client) {
      return left(new ResourceNotFoundError());
    }

    const bookings = await this.bookingsRepository.findManyByClientId(
      {
        page,
      },
      clientId.toString()
    );

    return right({
      bookings,
    });
  }
}
