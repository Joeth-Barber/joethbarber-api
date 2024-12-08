import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Booking } from "@/domain/barbershop/enterprise/entities/booking";
import { Prisma, Booking as PrismaBooking } from "@prisma/client";
import { PrismaProductMapper } from "./prisma-product-mapper";
import { PrismaServiceMapper } from "./prisma-service-mapper";

type RawBooking = PrismaBooking & {
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

export class PrismaBookingMapper {
  static toDomain(raw: RawBooking): Booking {
    return Booking.create(
      {
        clientId: new UniqueEntityId(raw.clientId),
        workScheduleId: new UniqueEntityId(raw.workScheduleId),
        date: raw.date,
        totalPrice: raw.totalPrice,
        description: raw.description,
        services: raw.services?.map(PrismaServiceMapper.toDomain) ?? [],
        products: raw.products?.map(PrismaProductMapper.toDomain) ?? [],
        status: raw.status,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? null,
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPrisma(booking: Booking): Prisma.BookingCreateInput {
    return {
      id: booking.id.toString(),
      client: {
        connect: { id: booking.clientId.toString() },
      },
      workScheduleId: booking.workScheduleId.toString(),
      date: booking.date,
      totalPrice: booking.totalPrice,
      description: booking.description,
      services: {
        connect: booking.services.map((service) => ({
          id: service.id.toString(),
        })),
      },
      products: {
        connect: booking.products.map((product) => ({
          id: product.id.toString(),
        })),
      },
      status: booking.status,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt ?? null,
    };
  }

  static toPrismaForUpdate(booking: Booking): Prisma.BookingUpdateInput {
    return {
      date: booking.date,
      totalPrice: booking.totalPrice,
      description: booking.description,
      services: {
        update: booking.services.map((service) => ({
          where: { id: service.id?.toString() },
          data: PrismaServiceMapper.toPrisma(service),
        })),
      },
      products: {
        update: booking.products.map((product) => ({
          where: { id: product.id?.toString() },
          data: PrismaProductMapper.toPrisma(product),
        })),
      },
      status: booking.status,
      updatedAt: new Date(),
    };
  }
}
