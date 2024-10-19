import { Barber } from "@/domain/barbershop/enterprise/entities/barber";

export class BarberPresenter {
  static toHTTP(barber: Barber) {
    return {
      id: barber.id.toString(),
      role: barber.role,
      fullName: barber.fullName,
      email: barber.email,
      createdAt: barber.createdAt,
      updatedAt: barber.updatedAt,
    };
  }
}
