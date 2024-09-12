import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  Booking,
  BookingProps,
} from "@/domain/barbershop/enterprise/entities/booking";
import { Product } from "@/domain/barbershop/enterprise/entities/product";
import { Service } from "@/domain/barbershop/enterprise/entities/service";
import { faker } from "@faker-js/faker";

export function makeBooking(
  override: Partial<BookingProps> = {},
  id?: UniqueEntityId
) {
  const services = override.services || [];
  const products = override.products || [];

  const totalPrice =
    services.reduce((sum: number, service: Service) => sum + service.price, 0) +
    products.reduce((sum: number, product: Product) => sum + product.price, 0);

  const booking = Booking.create(
    {
      clientId: new UniqueEntityId(),
      workScheduleId: new UniqueEntityId(),
      date: faker.date.future(),
      totalPrice,
      ...override,
    },
    id
  );

  return booking;
}
