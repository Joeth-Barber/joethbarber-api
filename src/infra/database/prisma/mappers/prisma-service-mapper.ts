import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Service } from "@/domain/barbershop/enterprise/entities/service";
import { Prisma, Service as PrismaService } from "@prisma/client";

export class PrismaServiceMapper {
  static toDomain(raw: PrismaService): Service {
    return Service.create(
      {
        name: raw.name,
        price: raw.price,
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPrisma(service: Service): Prisma.ServiceUncheckedCreateInput {
    return {
      id: service.id.toString(),
      name: service.name,
      price: service.price,
    };
  }
}
