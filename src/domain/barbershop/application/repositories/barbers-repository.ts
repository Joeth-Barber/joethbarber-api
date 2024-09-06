import { Barber } from "../../enterprise/entities/barber";

export abstract class BarbersRepository {
  abstract save(barber: Barber): Promise<void>;
  abstract findById(id: string): Promise<Barber | null>;
  abstract findByEmail(email: string): Promise<Barber | null>;
  abstract create(barber: Barber): Promise<void>;
}
