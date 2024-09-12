import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  Payment,
  PaymentProps,
} from "@/domain/barbershop/enterprise/entities/payment";
import { faker } from "@faker-js/faker";

export function makePayment(
  override: Partial<PaymentProps> = {},
  id?: UniqueEntityId
) {
  const payment = Payment.create(
    {
      clientId: new UniqueEntityId(),
      amount: faker.number.float({ max: 1000 }),
      ...override,
    },
    id
  );

  return payment;
}
