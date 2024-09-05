import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  Client,
  ClientProps,
} from "@/domain/barbershop/enterprise/entities/client";
import { CPF } from "@/domain/barbershop/enterprise/entities/value-objects/cpf";
import { faker } from "@faker-js/faker";

export function makeClient(
  override: Partial<ClientProps> = {},
  id?: UniqueEntityId
) {
  const client = Client.create(
    {
      fullName: faker.person.fullName(),
      nickName: faker.person.middleName(),
      phone: faker.string.numeric(11),
      cpf: CPF.create(faker.string.numeric(11)),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id
  );

  return client;
}
