import { PaymentsRepository } from "@/domain/barbershop/application/repositories/payments-repository";
import { Payment } from "@/domain/barbershop/enterprise/entities/payment";

export class InMemoryPaymentsRepository implements PaymentsRepository {
  public items: Payment[] = [];

  async findByBookingId(bookingId: string) {
    const payment = this.items.find((item) =>
      item.bookings.some((booking) => booking.id.toString() === bookingId)
    );

    if (!payment) {
      return null;
    }

    return payment;
  }

  async findLatestByClientId(clientId: string) {
    const clientPayments = this.items
      .filter((payment) => payment.clientId.toString() === clientId)
      .sort((a, b) => {
        if (!a.createdAt) return 1;
        if (!b.createdAt) return -1;
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
    if (clientPayments.length === 0) {
      return null;
    }

    return clientPayments[0];
  }

  async delete(payment: Payment) {
    const itemIndex = this.items.findIndex((item) => item.id === payment.id);

    this.items.splice(itemIndex, 1);
  }

  async fetchByClientId({ page }: { page: number }, id: string) {
    const clientPayments = this.items
      .filter((payment) => payment.clientId.toString() === id)
      .sort((a, b) => {
        if (!a.createdAt) return 1;
        if (!b.createdAt) return -1;
        return b.createdAt.getTime() - a.createdAt.getTime();
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
