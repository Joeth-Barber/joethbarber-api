import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { BarbersRepository } from "@/domain/barbershop/application/repositories/barbers-repository";
import { PrismaBarbersRepository } from "./prisma/repositories/prisma-barbers-repository";
import { ServicesRepository } from "@/domain/barbershop/application/repositories/services-repository";
import { PrismaServicesRepository } from "./prisma/repositories/prisma-services-repository";
import { ProductsRepository } from "@/domain/barbershop/application/repositories/products-repository";
import { PrismaProductsRepository } from "./prisma/repositories/prisma-products-repository";
import { ClientsRepository } from "@/domain/barbershop/application/repositories/clients-repository";
import { PrismaClientsRepository } from "./prisma/repositories/prisma-clients-repository";
import { WorkSchedulesRepository } from "@/domain/barbershop/application/repositories/work-schedules-repository";
import { PrismaWorkSchedulesRepository } from "./prisma/repositories/prisma-work-schedule-repository";
import { BookingsRepository } from "@/domain/barbershop/application/repositories/bookings-repository";
import { PrismaBookingsRepository } from "./prisma/repositories/prisma-bookings-repository";
import { PaymentsRepository } from "@/domain/barbershop/application/repositories/payments-repository";
import { PrismaPaymentsRepository } from "./prisma/repositories/prisma-payments-repository";

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: BarbersRepository,
      useClass: PrismaBarbersRepository,
    },
    {
      provide: ServicesRepository,
      useClass: PrismaServicesRepository,
    },
    {
      provide: ProductsRepository,
      useClass: PrismaProductsRepository,
    },
    {
      provide: ClientsRepository,
      useClass: PrismaClientsRepository,
    },
    {
      provide: WorkSchedulesRepository,
      useClass: PrismaWorkSchedulesRepository,
    },
    {
      provide: BookingsRepository,
      useClass: PrismaBookingsRepository,
    },
    {
      provide: PaymentsRepository,
      useClass: PrismaPaymentsRepository,
    },
  ],
  exports: [
    PrismaService,
    BarbersRepository,
    ServicesRepository,
    ProductsRepository,
    ClientsRepository,
    WorkSchedulesRepository,
    BookingsRepository,
    PaymentsRepository,
  ],
})
export class DatabaseModule {}
