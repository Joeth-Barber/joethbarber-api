import { PaymentsRepository } from "@/domain/barbershop/application/repositories/payments-repository";
import { Payment } from "@/domain/barbershop/enterprise/entities/payment";

export class InMemoryPaymentsRepository implements PaymentsRepository {
  public items: Payment[] = [];

  async save(payment: Payment) {
    const itemIndex = this.items.findIndex((item) => item.id === payment.id);

    this.items[itemIndex] = payment;
  }

  async findById(id: string) {
    const payment = this.items.find((item) => item.id.toString() === id);

    if (!payment) {
      return null;
    }

    return payment;
  }

  async create(payment: Payment) {
    this.items.push(payment);
  }
}
