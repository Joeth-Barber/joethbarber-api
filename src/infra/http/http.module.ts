import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { CreateBarberUseCase } from "@/domain/barbershop/application/use-cases/barber/create-barber";
import { CreateBarberAccountController } from "./controllers/barber/create-barber-account.controller";
import { GetBarberByIdController } from "./controllers/barber/find-barber-by-id.controller";
import { FindBarberByIdUseCase } from "@/domain/barbershop/application/use-cases/barber/find-barber-by-id";
import { UpdateBarberController } from "./controllers/barber/update-barber.controller";
import { UpdateBarberUseCase } from "@/domain/barbershop/application/use-cases/barber/update-barber";
import { AuthenticateController } from "./controllers/barber/authenticate-barber.controller";
import { AuthenticateBarberUseCase } from "@/domain/barbershop/application/use-cases/barber/authenticate-barber";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateBarberAccountController,
    GetBarberByIdController,
    UpdateBarberController,
    AuthenticateController,
  ],
  providers: [
    CreateBarberUseCase,
    FindBarberByIdUseCase,
    UpdateBarberUseCase,
    AuthenticateBarberUseCase,
  ],
})
export class HttpModule {}
