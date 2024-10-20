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
import { CreateProductController } from "./controllers/product/create-product.controller";
import { CreateProductUseCase } from "@/domain/barbershop/application/use-cases/products/create-product";
import { DeleteProductController } from "./controllers/product/delete-product.controller";
import { DeleteProductUseCase } from "@/domain/barbershop/application/use-cases/products/delete-product";
import { UpdateProductController } from "./controllers/product/update-product.controller";
import { UpdateProductUseCase } from "@/domain/barbershop/application/use-cases/products/update-product";
import { FetchProductsController } from "./controllers/product/fetch-product.controller";
import { FetchProductsUseCase } from "@/domain/barbershop/application/use-cases/products/fetch-products";
import { FindProductByIdUseCase } from "@/domain/barbershop/application/use-cases/products/find-product-by-id";
import { GetProductByIdController } from "./controllers/product/find-product-by-id.controller";

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
    CreateProductController,
    DeleteProductController,
    UpdateProductController,
    FetchProductsController,
    GetProductByIdController,
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
    CreateProductUseCase,
    DeleteProductUseCase,
    UpdateProductUseCase,
    FetchProductsUseCase,
    FindProductByIdUseCase,
  ],
})
export class HttpModule {}
