import { Payment } from "../../enterprise/entities/payment";

export abstract class PaymentsRepository {
  abstract save(payment: Payment): Promise<void>;
  abstract findById(id: string): Promise<Payment | null>;
  abstract create(payment: Payment): Promise<void>;
}
