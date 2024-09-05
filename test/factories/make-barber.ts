import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  Barber,
  BarberProps,
} from "@/domain/barbershop/enterprise/entities/barber";
import { faker } from "@faker-js/faker";

export function makeBarber(
  override: Partial<BarberProps> = {},
  id?: UniqueEntityId
) {
  const barber = Barber.create(
    {
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id
  );

  return barber;
}
