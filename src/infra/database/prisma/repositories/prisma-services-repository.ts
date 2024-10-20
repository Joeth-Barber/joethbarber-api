import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { ServicesRepository } from "@/domain/barbershop/application/repositories/services-repository";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { Service } from "@/domain/barbershop/enterprise/entities/service";
import { PrismaServiceMapper } from "../mappers/prisma-service-mapper";

@Injectable()
export class PrismaServicesRepository implements ServicesRepository {
  constructor(private prisma: PrismaService) {}

  async delete(service: Service): Promise<void> {
    await this.prisma.service.delete({
      where: {
        id: service.id.toString(),
      },
    });
  }

  async save(service: Service): Promise<void> {
    const data = PrismaServiceMapper.toPrisma(service);

    await this.prisma.service.update({
      where: {
        id: data.id,
      },
      data,
    });
  }

  async findById(id: string): Promise<Service | null> {
    const service = await this.prisma.service.findUnique({
      where: {
        id,
      },
    });

    if (!service) {
      return null;
    }

    return PrismaServiceMapper.toDomain(service);
  }

  async findMany({ page }: PaginationParams): Promise<Service[]> {
    const services = await this.prisma.service.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      skip: (page - 1) * 10,
    });

    return services.map(PrismaServiceMapper.toDomain);
  }

  async create(service: Service): Promise<void> {
    const data = PrismaServiceMapper.toPrisma(service);

    await this.prisma.service.create({
      data,
    });
  }
}
