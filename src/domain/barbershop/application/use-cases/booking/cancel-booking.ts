import { Injectable } from "@nestjs/common";
import { BookingsRepository } from "../../repositories/bookings-repository";
import { Either, left, right } from "@/core/either";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { BookingTooCloseToStartError } from "@/core/errors/booking-too-close-to-start";
import { NotAllowedError } from "@/core/errors/not-allowed";

interface CancelBookingUseCaseRequest {
  bookingId: UniqueEntityId;
  clientId: UniqueEntityId;
}

type CancelBookingUseCaseResponse = Either<ResourceNotFoundError, {}>;

@Injectable()
export class CancelBookingUseCase {
  constructor(private bookingsRepository: BookingsRepository) {}

  async execute({
    bookingId,
    clientId,
  }: CancelBookingUseCaseRequest): Promise<CancelBookingUseCaseResponse> {
    const booking = await this.bookingsRepository.findById(
      bookingId.toString()
    );

    if (!booking) {
      return left(new ResourceNotFoundError());
    }

    if (booking.clientId.toString() !== clientId.toString()) {
      return left(new NotAllowedError());
    }

    const now = new Date();
    const timeDifferenceInHours =
      (booking.date.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (timeDifferenceInHours < 3) {
      return left(new BookingTooCloseToStartError());
    }

    booking.status = "CANCELED";

    await this.bookingsRepository.save(booking);

    return right({});
  }
}
