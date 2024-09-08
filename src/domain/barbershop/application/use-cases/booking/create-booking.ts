import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/core/either";
import { Booking } from "../../../enterprise/entities/booking";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { Product } from "@/domain/barbershop/enterprise/entities/product";
import { Service } from "@/domain/barbershop/enterprise/entities/service";
import { BookingsRepository } from "../../repositories/bookings-repository";
import { ClientsRepository } from "../../repositories/clients-repository";
import { BookingDateOverlappingError } from "@/core/errors/booking-date-overlapping";

interface CreateBookingUseCaseRequest {
  clientId: UniqueEntityId;
  date: Date;
  totalPrice: number;
  description: string;
  products: Product[];
  services: Service[];
  status: "PENDING" | "COMPLETED";
}

type CreateBookingUseCaseResponse = Either<
  ResourceNotFoundError,
  { booking: Booking }
>;

@Injectable()
export class CreateBookingUseCase {
  constructor(
    private bookingsRepository: BookingsRepository,
    private clientsRepository: ClientsRepository
  ) {}

  async execute({
    clientId,
    date,
    description,
    products,
    services,
    status,
  }: CreateBookingUseCaseRequest): Promise<CreateBookingUseCaseResponse> {
    const client = await this.clientsRepository.findById(clientId.toString());

    if (!client) {
      return left(new ResourceNotFoundError());
    }

    const isBookingOverlapping = await this.bookingsRepository.findByDate(date);

    if (isBookingOverlapping) {
      return left(new BookingDateOverlappingError());
    }

    const calculatedTotalPrice =
      services.reduce((sum, service) => sum + service.price, 0) +
      products.reduce((sum, product) => sum + product.price, 0);

    const booking = Booking.create({
      clientId,
      date,
      totalPrice: calculatedTotalPrice,
      description,
      products,
      services,
      status,
    });

    await this.bookingsRepository.create(booking);

    // TODO: o totalPrice dessa booking deve ser adicionado ao campo AMOUNT da entity Payment

    return right({ booking });
  }
}
