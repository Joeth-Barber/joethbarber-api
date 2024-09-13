import { PaymentsRepository } from "@/domain/barbershop/application/repositories/payments-repository";
import { Payment } from "@/domain/barbershop/enterprise/entities/payment";

export class InMemoryPaymentsRepository implements PaymentsRepository {
  public items: Payment[] = [];

  async fetchByClientId(
    { page }: { page: number },
    id: string
  ): Promise<Payment[]> {
    const clientPayments = this.items
      .filter((payment) => payment.clientId.toString() === id)
      .sort((a, b) => {
        if (!a.paymentDate) return 1;
        if (!b.paymentDate) return -1;
        return b.paymentDate.getTime() - a.paymentDate.getTime();
      });

    const payments = clientPayments.slice((page - 1) * 10, page * 10);

    return payments;
  }

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
