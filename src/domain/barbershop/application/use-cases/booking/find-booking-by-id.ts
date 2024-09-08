import { Injectable } from "@nestjs/common";
import { BookingsRepository } from "../../repositories/bookings-repository";
import { Either, left, right } from "@/core/either";
import { Booking } from "@/domain/barbershop/enterprise/entities/booking";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

export interface FindBookingByIdUseCaseRequest {
  bookingId: UniqueEntityId;
}

type FindBookingByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  { booking: Booking }
>;

@Injectable()
export class FindBookingByIdUseCase {
  constructor(private bookingsRepository: BookingsRepository) {}

  async execute({
    bookingId,
  }: FindBookingByIdUseCaseRequest): Promise<FindBookingByIdUseCaseResponse> {
    const booking = await this.bookingsRepository.findById(
      bookingId.toString()
    );

    if (!booking) {
      return left(new ResourceNotFoundError());
    }

    return right({
      booking,
    });
  }
}
