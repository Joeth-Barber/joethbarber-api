import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  Service,
  ServiceProps,
} from "@/domain/barbershop/enterprise/entities/service";
import { faker } from "@faker-js/faker";

export function makeService(
  override: Partial<ServiceProps> = {},
  id?: UniqueEntityId
) {
  const service = Service.create(
    {
      name: faker.commerce.product(),
      price: faker.commerce.price(),
      ...override,
    },
    id
  );

  return service;
}
