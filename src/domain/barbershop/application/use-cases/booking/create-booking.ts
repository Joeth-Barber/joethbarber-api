import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/core/either";
import { Booking } from "../../../enterprise/entities/booking";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { BookingsRepository } from "../../repositories/bookings-repository";
import { ClientsRepository } from "../../repositories/clients-repository";
import { BookingDateOverlappingError } from "@/core/errors/booking-date-overlapping";
import { WorkSchedulesRepository } from "../../repositories/work-schedules-repository";
import { format, parseISO } from "date-fns";
import { PaymentsRepository } from "../../repositories/payments-repository";
import { Payment } from "@/domain/barbershop/enterprise/entities/payment";
import { ServicesRepository } from "../../repositories/services-repository";
import { ProductsRepository } from "../../repositories/products-repository";
import { Service } from "@/domain/barbershop/enterprise/entities/service";
import { Product } from "@/domain/barbershop/enterprise/entities/product";
import { BookingGateway } from "@/infra/http/ws/booking-gateway";

interface CreateBookingUseCaseRequest {
  clientId: UniqueEntityId;
  workScheduleId: UniqueEntityId;
  date: Date;
  description?: string;
  products?: { id: string }[];
  services?: { id: string }[];
  status?: "PENDING" | "COMPLETED" | "CANCELED";
}

type CreateBookingUseCaseResponse = Either<
  ResourceNotFoundError,
  { booking: Booking }
>;

@Injectable()
export class CreateBookingUseCase {
  constructor(
    private bookingsRepository: BookingsRepository,
    private clientsRepository: ClientsRepository,
    private paymentsRepository: PaymentsRepository,
    private workSchedulesRepository: WorkSchedulesRepository,
    private servicesRepository: ServicesRepository,
    private productsRepository: ProductsRepository,
    private bookingGateway: BookingGateway
  ) {}

  async execute({
    clientId,
    workScheduleId,
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

    const normalizedDate = parseISO(date.toISOString());

    const bookingStart = format(normalizedDate, "HH:mm");
    const bookingEnd = format(
      new Date(normalizedDate.getTime() + 30 * 60 * 1000),
      "HH:mm"
    );

    const workSchedule = await this.workSchedulesRepository.findById(
      workScheduleId.toString()
    );

    if (!workSchedule) {
      return left(new ResourceNotFoundError());
    }

    const workDay = workSchedule.workDays.find((day) => {
      return (
        day.dayOfWeek === normalizedDate.getDay() &&
        day.date === format(normalizedDate, "yyyy-MM-dd")
      );
    });

    if (!workDay || !workDay.availableHours) {
      return left(new ResourceNotFoundError());
    }

    const existingBooking =
      await this.bookingsRepository.findOverlappingBooking(
        workScheduleId,
        normalizedDate
      );

    if (existingBooking && existingBooking.status !== "CANCELED") {
      return left(new BookingDateOverlappingError());
    }

    const isAvailable = workDay.availableHours.some(
      (hour) => hour === bookingStart
    );

    if (!isAvailable) {
      return left(new BookingDateOverlappingError());
    }

    workDay.availableHours = workDay.availableHours.filter(
      (hour) => hour !== bookingStart
    );

    this.bookingGateway.notifyAvailableHoursUpdate(
      workScheduleId.toString(),
      workDay.availableHours
    );

    await this.workSchedulesRepository.save(workSchedule);

    const fullServices = await Promise.all(
      (services ?? []).map(({ id }) => this.servicesRepository.findById(id))
    );

    const fullProducts = await Promise.all(
      (products ?? []).map(({ id }) => this.productsRepository.findById(id))
    );

    const validServices = fullServices.filter(
      (service): service is Service => service !== null
    );
    const validProducts = fullProducts.filter(
      (product): product is Product => product !== null
    );

    const calculatedTotalPrice =
      validServices.reduce((sum, service) => sum + service.price, 0) +
      validProducts.reduce((sum, product) => sum + product.price, 0);

    const booking = Booking.create({
      clientId,
      workScheduleId,
      date: normalizedDate,
      totalPrice: calculatedTotalPrice,
      description,
      products: validProducts,
      services: validServices,
      status,
    });

    await this.bookingsRepository.create(booking);

    if (client.role === "CLIENT") {
      const payment = Payment.create({
        clientId: new UniqueEntityId(clientId.toString()),
        status: "PENDING",
        bookings: [booking],
        amount: booking.totalPrice,
      });

      await this.paymentsRepository.create(payment);
    }

    if (client.role === "MENSALIST") {
      const existingPayment =
        await this.paymentsRepository.findLatestByClientId(clientId.toString());

      if (!existingPayment) {
        const payment = Payment.create({
          clientId: new UniqueEntityId(clientId.toString()),
          status: "PENDING",
          bookings: [booking],
          amount: booking.totalPrice,
        });

        await this.paymentsRepository.create(payment);
      } else {
        existingPayment.amount += booking.totalPrice;
        existingPayment.bookings.push(booking);

        await this.paymentsRepository.save(existingPayment);
      }
    }

    return right({ booking });
  }
}
