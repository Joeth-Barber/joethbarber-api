import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Barber } from "@/domain/barbershop/enterprise/entities/barber";
import { Prisma, Barber as PrismaBarber } from "@prisma/client";

export class PrismaBarberMapper {
  static toDomain(raw: PrismaBarber): Barber {
    return Barber.create(
      {
        fullName: raw.fullName,
        email: raw.email,
        password: raw.password,
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPrisma(barber: Barber): Prisma.BarberUncheckedCreateInput {
    return {
      id: barber.id.toString(),
      fullName: barber.fullName,
      email: barber.email,
      password: barber.password,
    };
  }
}
