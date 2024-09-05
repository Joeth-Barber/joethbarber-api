import { Barber } from "../../enterprise/entities/barber";

export abstract class BarbersRepository {
  abstract findByEmail(email: string): Promise<Barber | null>;
  abstract create(barber: Barber): Promise<void>;
}
