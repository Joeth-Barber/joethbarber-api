import { Injectable } from "@nestjs/common";
import { BookingsRepository } from "../../repositories/bookings-repository";
import { Either, left, right } from "@/core/either";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { BookingTooCloseToStartError } from "@/core/errors/booking-too-close-to-start";
import { NotAllowedError } from "@/core/errors/not-allowed";
import { WorkSchedulesRepository } from "../../repositories/work-schedules-repository";
import { format } from "date-fns";
import { ClientsRepository } from "../../repositories/clients-repository";
import { PaymentsRepository } from "../../repositories/payments-repository";
import { Booking } from "@/domain/barbershop/enterprise/entities/booking";

interface CancelBookingUseCaseRequest {
  bookingId: UniqueEntityId;
  clientId: UniqueEntityId;
}

type CancelBookingUseCaseResponse = Either<
  ResourceNotFoundError,
  { booking: Booking }
>;

@Injectable()
export class CancelBookingUseCase {
  constructor(
    private bookingsRepository: BookingsRepository,
    private clientsRepository: ClientsRepository,
    private paymentsRepository: PaymentsRepository,
    private workSchedulesRepository: WorkSchedulesRepository
  ) {}

  async execute({
    bookingId,
    clientId,
  }: CancelBookingUseCaseRequest): Promise<CancelBookingUseCaseResponse> {
    const client = await this.clientsRepository.findById(clientId.toString());

    if (!client) {
      return left(new ResourceNotFoundError());
    }

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

    if (client.role === "CLIENT") {
      const payment = await this.paymentsRepository.findByBookingId(
        bookingId.toString()
      );
      if (payment) {
        await this.paymentsRepository.delete(payment);
      }
    }

    if (client.role === "MENSALIST") {
      const payment = await this.paymentsRepository.findLatestByClientId(
        clientId.toString()
      );
      if (payment) {
        payment.amount -= booking.totalPrice;
        if (payment.amount < 0) payment.amount = 0;
        await this.paymentsRepository.save(payment);
      }
    }

    if (client.role === "CLIENT") {
      const payment = await this.paymentsRepository.findByBookingId(
        bookingId.toString()
      );
      if (payment) {
        await this.paymentsRepository.delete(payment);
      }
    }

    const workSchedule = await this.workSchedulesRepository.findById(
      booking.workScheduleId.toString()
    );

    if (!workSchedule) {
      return left(new ResourceNotFoundError());
    }

    const bookingStart = format(booking.date, "HH:mm");
    const workDay = workSchedule.workDays.find(
      (day) => day.dayOfWeek === booking.date.getDay()
    );

    if (workDay && workDay.availableHours) {
      if (!workDay.availableHours.includes(bookingStart)) {
        workDay.availableHours.push(bookingStart);
        workDay.availableHours.sort();
      }
    }

    await this.workSchedulesRepository.save(workSchedule);

    return right({
      booking,
    });
  }
}
