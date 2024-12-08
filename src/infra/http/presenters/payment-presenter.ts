import { Payment } from "@/domain/barbershop/enterprise/entities/payment";
import { format } from "date-fns";

export class PaymentPresenter {
  static toHTTP(payment: Payment) {
    return {
      id: payment.id.toString(),
      clientId: payment.clientId.toString(),
      status: payment.status,
      amount: payment.amount,
      paymentDate: payment.paymentDate
        ? format(payment.paymentDate, "dd/MM/yyyy")
        : null,
    };
  }
}
