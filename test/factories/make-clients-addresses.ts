import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Address } from "@/domain/barbershop/enterprise/entities/address";
import { faker } from "@faker-js/faker";

export function makeClientsAddresses(
  override: Partial<Address> = {},
  id?: UniqueEntityId
) {
  const clientAddress = Address.create(
    {
      clientId: new UniqueEntityId(),
      zipCode: faker.string.numeric(6),
      state: faker.location.state(),
      city: faker.location.city(),
      neighborhood: faker.location.street(),
      address: faker.location.streetAddress(),
      number: faker.location.buildingNumber(),
      ...override,
    },
    id
  );

  return clientAddress;
}
