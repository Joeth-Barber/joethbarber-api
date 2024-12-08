import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { ClientsRepository } from "@/domain/barbershop/application/repositories/clients-repository";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { Client } from "@/domain/barbershop/enterprise/entities/client";
import { PrismaClientMapper } from "../mappers/prisma-client-mapper";

@Injectable()
export class PrismaClientsRepository implements ClientsRepository {
  constructor(private prisma: PrismaService) {}

  async save(client: Client): Promise<void> {
    const data = PrismaClientMapper.toPrisma(client);

    await this.prisma.client.update({
      where: {
        id: data.id,
      },
      data,
    });
  }

  async findMany({ page }: PaginationParams): Promise<Client[]> {
    const clients = await this.prisma.client.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      skip: (page - 1) * 10,
      include: {
        bookings: {
          include: {
            services: true,
            products: true,
          },
        },
        payments: true,
      },
    });

    return clients.map(PrismaClientMapper.toDomain);
  }

  async delete(client: Client): Promise<void> {
    const data = PrismaClientMapper.toPrisma(client);

    await this.prisma.client.delete({
      where: {
        id: data.id,
      },
    });
  }

  async findById(id: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({
      where: {
        id,
      },
      include: {
        bookings: {
          include: {
            services: true,
            products: true,
          },
        },
        payments: true,
      },
    });

    if (!client) {
      return null;
    }

    return PrismaClientMapper.toDomain(client);
  }

  async findByPhone(phone: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({
      where: {
        phone,
      },
      include: {
        bookings: {
          include: {
            services: true,
            products: true,
          },
        },
        payments: true,
      },
    });

    if (!client) {
      return null;
    }

    return PrismaClientMapper.toDomain(client);
  }

  async findByCpf(cpf: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({
      where: {
        cpf,
      },
      include: {
        bookings: {
          include: {
            services: true,
            products: true,
          },
        },
        payments: true,
      },
    });

    if (!client) {
      return null;
    }

    return PrismaClientMapper.toDomain(client);
  }

  async findByEmail(email: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({
      where: {
        email,
      },
      include: {
        bookings: {
          include: {
            services: true,
            products: true,
          },
        },
        payments: true,
      },
    });

    if (!client) {
      return null;
    }

    return PrismaClientMapper.toDomain(client);
  }

  async create(client: Client): Promise<void> {
    const data = PrismaClientMapper.toPrisma(client);

    await this.prisma.client.create({
      data,
    });
  }
}
