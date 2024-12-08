import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Client } from "@/domain/barbershop/enterprise/entities/client";
import { Prisma, Client as PrismaClient } from "@prisma/client";

export class PrismaClientMapper {
  static toDomain(
    raw: PrismaClient & { bookings?: any[]; payments?: any[] }
  ): Client {
    const client = Client.create(
      {
        role: raw.role,
        fullName: raw.fullName,
        nickName: raw.nickName,
        phone: raw.phone,
        cpf: raw.cpf,
        billingDay: raw.billingDay,
        email: raw.email,
        bookings: raw.bookings || [],
        payments: raw.payments || [],
      },
      new UniqueEntityId(raw.id)
    );

    return client;
  }

  static toPrisma(client: Client): Prisma.ClientUncheckedCreateInput {
    return {
      id: client.id.toString(),
      role: client.role,
      fullName: client.fullName,
      nickName: client.nickName,
      phone: client.phone,
      cpf: client.cpf,
      billingDay: client.billingDay,
      email: client.email,
    };
  }
}
