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
  ],
  exports: [
    PrismaService,
    BarbersRepository,
    ServicesRepository,
    ProductsRepository,
    ClientsRepository,
  ],
})
export class DatabaseModule {}
