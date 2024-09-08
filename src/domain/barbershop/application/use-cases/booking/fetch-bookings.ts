import { Injectable } from "@nestjs/common";
import { BookingsRepository } from "../../repositories/bookings-repository";
import { Either, right } from "@/core/either";
import { Booking } from "@/domain/barbershop/enterprise/entities/booking";

export interface FetchBookingsUseCaseRequest {
  page: number;
}

type FetchBookingsUseCaseResponse = Either<null, { bookings: Booking[] }>;

@Injectable()
export class FetchBookingsUseCase {
  constructor(private bookingsRepository: BookingsRepository) {}

  async execute({
    page,
  }: FetchBookingsUseCaseRequest): Promise<FetchBookingsUseCaseResponse> {
    const bookings = await this.bookingsRepository.findMany({ page });

    return right({
      bookings,
    });
  }
}
