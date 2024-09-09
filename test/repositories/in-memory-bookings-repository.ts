import { PaginationParams } from "@/core/repositories/pagination-params";
import { BookingsRepository } from "@/domain/barbershop/application/repositories/bookings-repository";
import { Booking } from "@/domain/barbershop/enterprise/entities/booking";

export class InMemoryBookingsRepository implements BookingsRepository {
  public items: Booking[] = [];

  async save(booking: Booking) {
    const itemIndex = this.items.findIndex((item) => item.id === booking.id);

    this.items[itemIndex] = booking;
  }

  async findByDate(date: Date) {
    const booking = this.items.find(
      (item) => item.date.getTime() === date.getTime()
    );

    if (!booking) {
      return null;
    }

    return booking;
  }

  async findMany({ page }: PaginationParams) {
    const bookings = this.items.slice((page - 1) * 10, page * 10);

    return bookings;
  }

  async cancel(booking: Booking) {
    const itemIndex = this.items.findIndex((item) => item.id === booking.id);

    this.items.splice(itemIndex, 1);
  }

  async findById(id: string) {
    const booking = this.items.find((item) => item.id.toString() === id);

    if (!booking) {
      return null;
    }

    return booking;
  }

  async create(booking: Booking) {
    this.items.push(booking);
  }
}
