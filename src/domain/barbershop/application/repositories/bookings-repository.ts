import { PaginationParams } from "@/core/repositories/pagination-params";
import { Booking } from "../../enterprise/entities/booking";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export abstract class BookingsRepository {
  abstract save(booking: Booking): Promise<void>;
  abstract findOverlappingBooking(
    workScheduleId: UniqueEntityId,
    date: Date
  ): Promise<Booking | null>;
  abstract findByDate(date: Date): Promise<Booking | null>;
  abstract findMany(params: PaginationParams): Promise<Booking[]>;
  abstract cancel(booking: Booking): Promise<void>;
  abstract findById(id: string): Promise<Booking | null>;
  abstract create(booking: Booking): Promise<void>;
}
