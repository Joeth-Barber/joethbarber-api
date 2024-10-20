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
import { CreateServiceController } from "./controllers/service/create-service.controller";
import { CreateServiceUseCase } from "@/domain/barbershop/application/use-cases/services/create-service";
import { DeleteServiceController } from "./controllers/service/delete-service.controller";
import { DeleteServiceUseCase } from "@/domain/barbershop/application/use-cases/services/delete-service";
import { FetchServicesController } from "./controllers/service/fetch-service.controller";
import { FetchServicesUseCase } from "@/domain/barbershop/application/use-cases/services/fetch-services";
import { GetServiceByIdController } from "./controllers/service/find-service-by-id.controller";
import { FindServiceByIdUseCase } from "@/domain/barbershop/application/use-cases/services/find-service-by-id";
import { UpdateServiceController } from "./controllers/service/update-service.controller";
import { UpdateServiceUseCase } from "@/domain/barbershop/application/use-cases/services/update-service";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateBarberAccountController,
    GetBarberByIdController,
    UpdateBarberController,
    AuthenticateController,
    CreateServiceController,
    DeleteServiceController,
    FetchServicesController,
    GetServiceByIdController,
    UpdateServiceController,
  ],
  providers: [
    CreateBarberUseCase,
    FindBarberByIdUseCase,
    UpdateBarberUseCase,
    AuthenticateBarberUseCase,
    CreateServiceUseCase,
    DeleteServiceUseCase,
    FetchServicesUseCase,
    FindServiceByIdUseCase,
    UpdateServiceUseCase,
  ],
})
export class HttpModule {}
