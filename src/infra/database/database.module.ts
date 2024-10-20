import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { BarbersRepository } from "@/domain/barbershop/application/repositories/barbers-repository";
import { PrismaBarbersRepository } from "./prisma/repositories/prisma-barbers-repository";
import { ServicesRepository } from "@/domain/barbershop/application/repositories/services-repository";
import { PrismaServicesRepository } from "./prisma/repositories/prisma-services-repository";

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
  ],
  exports: [PrismaService, BarbersRepository, ServicesRepository],
})
export class DatabaseModule {}
