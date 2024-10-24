import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  Client,
  ClientProps,
} from "@/domain/barbershop/enterprise/entities/client";
import { faker } from "@faker-js/faker";

export function makeClient(
  override: Partial<ClientProps> = {},
  id?: UniqueEntityId
) {
  const formattedCpf = formatCpf(faker.string.numeric(11));
  const formattedPhone = formatPhone(faker.string.numeric(11));

  const client = Client.create(
    {
      fullName: faker.person.fullName(),
      nickName: faker.person.middleName(),
      phone: formattedPhone,
      cpf: formattedCpf,
      email: faker.internet.email(),
      ...override,
    },
    id
  );

  return client;
}

function formatCpf(cpf: string): string {
  const digitsOnly = cpf.replace(/\D/g, "");
  return digitsOnly.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatPhone(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, "");
  return digitsOnly.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
}
