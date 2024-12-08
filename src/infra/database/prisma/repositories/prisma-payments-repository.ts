import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PaymentsRepository } from "@/domain/barbershop/application/repositories/payments-repository";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { Payment } from "@/domain/barbershop/enterprise/entities/payment";
import { PrismaPaymentMapper } from "../mappers/prisma-payment-mapper";

@Injectable()
export class PrismaPaymentsRepository implements PaymentsRepository {
  constructor(private prisma: PrismaService) {}

  async save(payment: Payment): Promise<void> {
    await this.prisma.payment.update({
      where: { id: payment.id.toString() },
      data: PrismaPaymentMapper.toPrisma(payment),
    });
  }

  async findById(id: string): Promise<Payment | null> {
    const rawPayment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        bookings: {
          include: {
            services: true,
            products: true,
          },
        },
        products: true,
      },
    });

    if (!rawPayment) return null;
    return PrismaPaymentMapper.toDomain(rawPayment);
  }

  async delete(payment: Payment): Promise<void> {
    await this.prisma.payment.delete({
      where: { id: payment.id.toString() },
    });
  }

  async fetchByClientId(
    { page }: PaginationParams,
    clientId: string
  ): Promise<Payment[]> {
    const rawPayments = await this.prisma.payment.findMany({
      where: { clientId },
      skip: (page - 1) * 10,
      take: 10,
      include: {
        bookings: {
          include: {
            services: true,
            products: true,
          },
        },
        products: true,
      },
    });

    return rawPayments.map(PrismaPaymentMapper.toDomain);
  }

  async findLatestByClientId(clientId: string): Promise<Payment | null> {
    const rawPayment = await this.prisma.payment.findFirst({
      where: { clientId },
      orderBy: { createdAt: "desc" },
      include: {
        bookings: {
          include: {
            services: true,
            products: true,
          },
        },
        products: true,
      },
    });

    if (!rawPayment) return null;
    return PrismaPaymentMapper.toDomain(rawPayment);
  }

  async findByBookingId(bookingId: string): Promise<Payment | null> {
    const rawPayment = await this.prisma.payment.findFirst({
      where: {
        bookings: {
          some: {
            id: bookingId,
          },
        },
      },
      include: {
        bookings: {
          include: {
            services: true,
            products: true,
          },
        },
        products: true,
      },
    });

    if (!rawPayment) return null;
    return PrismaPaymentMapper.toDomain(rawPayment);
  }

  async create(payment: Payment): Promise<void> {
    const data = PrismaPaymentMapper.toPrisma(payment);

    await this.prisma.payment.create({
      data,
    });
  }
}
