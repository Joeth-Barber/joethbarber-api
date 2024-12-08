import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Payment } from "@/domain/barbershop/enterprise/entities/payment";
import {
  BookingStatus,
  Prisma,
  Payment as PrismaPayment,
} from "@prisma/client";
import { PrismaBookingMapper } from "./prisma-booking-mapper";
import { PrismaProductMapper } from "./prisma-product-mapper";

type RawBooking = {
  id: string;
  clientId: string;
  workScheduleId: string;
  date: Date;
  totalPrice: number;
  description: string;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date | null;
  services: Array<{
    id: string;
    name: string;
    price: number;
    createdAt: Date;
    updatedAt: Date | null;
  }>;
  products: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    createdAt: Date;
    updatedAt: Date | null;
  }>;
};

type RawPayment = PrismaPayment & {
  bookings: Array<RawBooking>;
  products: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    createdAt: Date;
    updatedAt: Date | null;
  }>;
};

export class PrismaPaymentMapper {
  static toDomain(raw: RawPayment): Payment {
    return Payment.create(
      {
        clientId: new UniqueEntityId(raw.clientId),
        status: raw.status,
        bookings: raw.bookings.map((booking) =>
          PrismaBookingMapper.toDomain(booking)
        ),
        products: raw.products.map((product) =>
          PrismaProductMapper.toDomain(product)
        ),
        amount: raw.amount,
        paymentDate: raw.paymentDate,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? null,
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPrisma(payment: Payment): Prisma.PaymentCreateInput {
    return {
      client: { connect: { id: payment.clientId.toString() } },
      amount: payment.amount,
      status: payment.status,
      paymentDate: payment.paymentDate,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt ?? null,
      bookings: {
        connect: payment.bookings.map((booking) => ({
          id: booking.id.toString(),
        })),
      },
      products: {
        connect: payment.products.map((product) => ({
          id: product.id.toString(),
        })),
      },
    };
  }
}
