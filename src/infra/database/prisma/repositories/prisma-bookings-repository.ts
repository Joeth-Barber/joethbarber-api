import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { BookingsRepository } from "@/domain/barbershop/application/repositories/bookings-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { Booking } from "@/domain/barbershop/enterprise/entities/booking";
import { PrismaBookingMapper } from "../mappers/prisma-booking-mapper";

@Injectable()
export class PrismaBookingsRepository implements BookingsRepository {
  constructor(private prisma: PrismaService) {}

  async save(booking: Booking): Promise<void> {
    const data = PrismaBookingMapper.toPrisma(booking);

    await this.prisma.booking.update({
      where: {
        id: data.id?.toString(),
      },
      data,
    });
  }

  async findOverlappingBooking(
    workScheduleId: UniqueEntityId,
    date: Date
  ): Promise<Booking | null> {
    const startOfBooking = new Date(date);
    const endOfBooking = new Date(date.getTime() + 30 * 60 * 1000);

    const booking = await this.prisma.booking.findFirst({
      where: {
        workScheduleId: workScheduleId.toString(),
        date: {
          gte: startOfBooking,
          lt: endOfBooking,
        },
      },
      include: {
        services: true,
        products: true,
      },
    });

    return booking ? PrismaBookingMapper.toDomain(booking) : null;
  }

  async findMany({ page }: PaginationParams): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      skip: (page - 1) * 10,
      include: {
        services: true,
        products: true,
      },
    });

    return bookings.map(PrismaBookingMapper.toDomain);
  }

  async findManyByClientId(
    { page }: PaginationParams,
    clientId: string
  ): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({
      where: { clientId },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      skip: (page - 1) * 10,
      include: {
        services: true,
        products: true,
      },
    });

    return bookings.map(PrismaBookingMapper.toDomain);
  }

  async findById(id: string): Promise<Booking | null> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        services: true,
        products: true,
      },
    });

    return booking ? PrismaBookingMapper.toDomain(booking) : null;
  }

  async cancel(booking: Booking): Promise<Booking | null> {
    const updatedBooking = await this.prisma.booking.update({
      where: { id: booking.id.toString() },
      data: {
        status: "CANCELED",
        updatedAt: new Date(),
      },
      include: {
        services: true,
        products: true,
      },
    });

    return PrismaBookingMapper.toDomain(updatedBooking);
  }

  async create(booking: Booking): Promise<void> {
    const data = PrismaBookingMapper.toPrisma(booking);

    await this.prisma.booking.create({
      data,
    });
  }
}
