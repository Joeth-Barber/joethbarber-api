import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { BookingsRepository } from "@/domain/barbershop/application/repositories/bookings-repository";
import { Booking } from "@/domain/barbershop/enterprise/entities/booking";

export class InMemoryBookingsRepository implements BookingsRepository {
  public items: Booking[] = [];

  async findManyByClientId({ page }: PaginationParams, clientId: string) {
    const clientBookings = this.items
      .filter((booking) => booking.clientId.toString() === clientId)
      .sort((a, b) => {
        if (!a.createdAt) return 1;
        if (!b.createdAt) return -1;
        return b.createdAt.getTime() - a.createdAt.getTime();
      });

    const bookings = clientBookings.slice((page - 1) * 10, page * 10);

    return bookings;
  }

  async findOverlappingBooking(
    workScheduleId: UniqueEntityId,
    date: Date
  ): Promise<Booking | null> {
    const bookingStart = date.getTime();
    const bookingEnd = bookingStart + 60 * 60 * 1000;

    const conflictingBooking = this.items.find((booking) => {
      const existingStart = booking.date.getTime();
      const existingEnd = existingStart + 60 * 60 * 1000;

      return (
        booking.workScheduleId.equals(workScheduleId) &&
        bookingStart < existingEnd &&
        bookingEnd > existingStart
      );
    });

    return conflictingBooking || null;
  }

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

    if (itemIndex !== -1) {
      const [removedItem] = this.items.splice(itemIndex, 1);
      return removedItem;
    }

    return null;
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
