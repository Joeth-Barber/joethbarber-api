import { Barber } from "@/domain/barbershop/enterprise/entities/barber";
import { format } from "date-fns";

export class BarberPresenter {
  static toHTTP(barber: Barber) {
    return {
      id: barber.id.toString(),
      role: barber.role,
      fullName: barber.fullName,
      email: barber.email,
      // createdAt: format(barber.createdAt, "dd/MM/yyyy"),
      // updatedAt: barber.updatedAt,
    };
  }
}
