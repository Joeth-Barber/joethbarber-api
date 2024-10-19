import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { CreateBarberUseCase } from "@/domain/barbershop/application/use-cases/barber/create-barber";
import { CreateBarberAccountController } from "./controllers/barber/create-barber-account.controller";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [CreateBarberAccountController],
  providers: [CreateBarberUseCase],
})
export class HttpModule {}
