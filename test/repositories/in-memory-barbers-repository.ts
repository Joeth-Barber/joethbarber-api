import { BarbersRepository } from "@/domain/barbershop/application/repositories/barbers-repository";
import { Barber } from "@/domain/barbershop/enterprise/entities/barber";

export class InMemoryBarbersRepository implements BarbersRepository {
  public items: Barber[] = [];

  async findByEmail(email: string) {
    const barber = this.items.find((item) => item.email === email);

    if (!barber) {
      return null;
    }

    return barber;
  }

  async create(barber: Barber) {
    this.items.push(barber);
  }
}
