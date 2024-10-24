import { Client } from "@/domain/barbershop/enterprise/entities/client";

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
      payments: client.payments,
      bookings: client.bookings,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}
