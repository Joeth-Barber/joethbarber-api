import { Injectable } from "@nestjs/common";
import { BarbersRepository } from "@/domain/barbershop/application/repositories/barbers-repository";
import { Barber } from "@/domain/barbershop/enterprise/entities/barber";
import { PrismaService } from "../prisma.service";
import { PrismaBarberMapper } from "../mappers/prisma-barber-mapper";

@Injectable()
export class PrismaBarbersRepository implements BarbersRepository {
  constructor(private prisma: PrismaService) {}
  async save(barber: Barber): Promise<void> {
    const data = PrismaBarberMapper.toPrisma(barber);

    await this.prisma.barber.update({
      where: {
        id: data.id,
      },
      data,
    });
  }

  async findById(id: string): Promise<Barber | null> {
    const barber = await this.prisma.barber.findUnique({
      where: {
        id,
      },
    });

    if (!barber) {
      return null;
    }

    return PrismaBarberMapper.toDomain(barber);
  }

  async findByEmail(email: string): Promise<Barber | null> {
    const barber = await this.prisma.barber.findUnique({
      where: {
        email,
      },
    });

    if (!barber) {
      return null;
    }

    return PrismaBarberMapper.toDomain(barber);
  }

  async create(barber: Barber): Promise<void> {
    const data = PrismaBarberMapper.toPrisma(barber);

    await this.prisma.barber.create({
      data,
    });
  }
}
