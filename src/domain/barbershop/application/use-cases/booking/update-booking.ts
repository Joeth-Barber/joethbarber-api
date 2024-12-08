import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/core/either";
import { Booking } from "../../../enterprise/entities/booking";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { BookingsRepository } from "../../repositories/bookings-repository";
import { WorkSchedulesRepository } from "../../repositories/work-schedules-repository";
import { BookingDateOverlappingError } from "@/core/errors/booking-date-overlapping";
import { ServicesRepository } from "../../repositories/services-repository";
import { ProductsRepository } from "../../repositories/products-repository";
import { PaymentsRepository } from "../../repositories/payments-repository";
import { Service } from "@/domain/barbershop/enterprise/entities/service";
import { Product } from "@/domain/barbershop/enterprise/entities/product";
import { format } from "date-fns";

interface UpdateBookingUseCaseRequest {
  bookingId: UniqueEntityId;
  newDate?: Date;
  products?: { id: string }[];
  services?: { id: string }[];
  description?: string;
  totalPrice?: number;
}

type UpdateBookingUseCaseResponse = Either<
  ResourceNotFoundError | BookingDateOverlappingError,
  { booking: Booking }
>;

@Injectable()
export class UpdateBookingUseCase {
  constructor(
    private bookingsRepository: BookingsRepository,
    private workSchedulesRepository: WorkSchedulesRepository,
    private servicesRepository: ServicesRepository,
    private productsRepository: ProductsRepository,
    private paymentsRepository: PaymentsRepository
  ) {}

  async execute({
    bookingId,
    newDate,
    products,
    services,
    description,
    totalPrice,
  }: UpdateBookingUseCaseRequest): Promise<UpdateBookingUseCaseResponse> {
    const booking = await this.bookingsRepository.findById(
      bookingId.toString()
    );

    if (!booking) {
      return left(new ResourceNotFoundError());
    }

    if (booking.status !== "PENDING") {
      return left(new ResourceNotFoundError());
    }

    const workSchedule = await this.workSchedulesRepository.findById(
      booking.workScheduleId.toString()
    );

    if (!workSchedule) {
      return left(new ResourceNotFoundError());
    }

    const oldDate = booking.date; // Armazena a data antiga

    if (newDate) {
      const newBookingStart = format(newDate, "HH:mm");
      const oldBookingStart = format(oldDate, "HH:mm"); // Hora antiga
      const workDay = workSchedule.workDays.find(
        (day) => day.dayOfWeek === newDate.getDay()
      );

      if (!workDay || !workDay.availableHours) {
        return left(new ResourceNotFoundError());
      }

      // Libera o horário antigo
      const oldWorkDay = workSchedule.workDays.find(
        (day) => day.dayOfWeek === oldDate.getDay()
      );

      if (oldWorkDay && oldWorkDay.availableHours) {
        if (
          oldWorkDay &&
          !oldWorkDay.availableHours.includes(oldBookingStart)
        ) {
          oldWorkDay.availableHours.push(oldBookingStart);
          oldWorkDay.availableHours.sort();
        }
      }

      const existingBooking =
        await this.bookingsRepository.findOverlappingBooking(
          workSchedule.id,
          newDate
        );

      if (existingBooking && existingBooking.status !== "CANCELED") {
        return left(new BookingDateOverlappingError());
      }

      const isAvailable = workDay.availableHours.some(
        (hour) => hour === newBookingStart
      );

      if (!isAvailable) {
        return left(new BookingDateOverlappingError());
      }

      // Atualiza a data da reserva
      booking.date = newDate;

      // Remove o novo horário dos horários disponíveis
      workDay.availableHours = workDay.availableHours.filter(
        (hour) => hour !== newBookingStart
      );

      await this.workSchedulesRepository.save(workSchedule);
    }

    // Atualiza serviços e produtos, se fornecidos
    if (services) {
      const fullServices = await Promise.all(
        services.map(({ id }) => this.servicesRepository.findById(id))
      );

      booking.services = fullServices.filter(
        (service): service is Service => service !== null
      );
    }

    if (products) {
      const fullProducts = await Promise.all(
        products.map(({ id }) => this.productsRepository.findById(id))
      );

      booking.products = fullProducts.filter(
        (product): product is Product => product !== null
      );
    }

    // Atualiza ou recalcula o totalPrice
    if (totalPrice !== undefined) {
      booking.totalPrice = totalPrice;
    } else {
      const calculatedTotalPrice =
        (booking.services?.reduce((sum, service) => sum + service.price, 0) ||
          0) +
        (booking.products?.reduce((sum, product) => sum + product.price, 0) ||
          0);

      booking.totalPrice = calculatedTotalPrice;
    }

    // Atualiza o pagamento associado, se houver
    const payment = await this.paymentsRepository.findByBookingId(
      bookingId.toString()
    );

    if (payment) {
      payment.amount = booking.totalPrice;
      await this.paymentsRepository.save(payment);
    }

    if (description && description !== booking.description) {
      booking.description = description;
    }

    await this.bookingsRepository.save(booking);

    return right({ booking });
  }
}
