import { Booking } from "@/domain/barbershop/enterprise/entities/booking";
import { format } from "date-fns";
import { ServicePresenter } from "./service-presenter";
import { ProductPresenter } from "./product-presenter";

export class BookingPresenter {
  static toHTTP(booking: Booking) {
    return {
      id: booking.id.toString(),
      clientId: booking.clientId.toString(),
      workScheduleId: booking.workScheduleId.toString(),
      status: booking.status,
      date: format(booking.date, "dd/MM/yyyy, HH:mm"),
      services: (booking.services ?? []).map(ServicePresenter.toHTTP),
      products: (booking.products ?? []).map(ProductPresenter.toHTTP),
      totalPrice: booking.totalPrice,
    };
  }
}
