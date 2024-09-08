import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  Booking,
  BookingProps,
} from "@/domain/barbershop/enterprise/entities/booking";
import { faker } from "@faker-js/faker";

export function makeBooking(
  override: Partial<BookingProps> = {},
  id?: UniqueEntityId
) {
  const booking = Booking.create(
    {
      clientId: new UniqueEntityId(),
      date: faker.date.future({ years: 10 }),
      totalPrice: faker.number.float({ max: 1000 }),
      ...override,
    },
    id
  );

  return booking;
}
