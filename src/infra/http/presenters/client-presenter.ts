import { Client } from "@/domain/barbershop/enterprise/entities/client";
import { BookingPresenter } from "./booking-presenter";
import { PaymentPresenter } from "./payment-presenter";
import { format } from "date-fns";

export class ClientPresenter {
  static toHTTP(client: Client) {
    return {
      id: client.id.toString(),
      role: client.role,
      fullName: client.fullName,
      nickName: client.nickName,
      phone: client.phone,
      email: client.email,
      billingDay: client.billingDay,
      payments: client.payments.map(PaymentPresenter.toHTTP),
      bookings: client.bookings.map(BookingPresenter.toHTTP),
      createdAt: format(client.createdAt, "dd/MM/yyyy"),
      updatedAt: client.updatedAt,
    };
  }
}
