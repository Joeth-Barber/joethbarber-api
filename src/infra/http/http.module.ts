import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { CreateBarberUseCase } from "@/domain/barbershop/application/use-cases/barber/create-barber";
import { CreateBarberAccountController } from "./controllers/barber/create-barber-account.controller";
import { GetBarberByIdController } from "./controllers/barber/find-barber-by-id.controller";
import { FindBarberByIdUseCase } from "@/domain/barbershop/application/use-cases/barber/find-barber-by-id";
import { UpdateBarberController } from "./controllers/barber/update-barber.controller";
import { UpdateBarberUseCase } from "@/domain/barbershop/application/use-cases/barber/update-barber";
import { AuthenticateBarberController } from "./controllers/barber/authenticate-barber.controller";
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
import { AuthenticateClientController } from "./controllers/client/authenticate-client.controller";
import { AuthenticateClientUseCase } from "@/domain/barbershop/application/use-cases/clients/authenticate-client";
import { AuthModule } from "../auth/auth.module";
import { VerifyMagicLinkController } from "./controllers/client/verify-magic-link.controller";
import { CompleteClientRegistrationController } from "./controllers/client/complete-client-registration.controller";
import { CompleteClientRegistrationUseCase } from "@/domain/barbershop/application/use-cases/clients/complete-client-registration";
import { RegisterClientController } from "./controllers/client/register-client-with-magic-link.controller";
import { RegisterClientWithMagicLinkUseCase } from "@/domain/barbershop/application/use-cases/clients/register-client-with-magic-link";
import { DeleteClientController } from "./controllers/client/delete-client.controller";
import { DeleteClientUseCase } from "@/domain/barbershop/application/use-cases/clients/delete-client";
import { FetchClientsController } from "./controllers/client/fetch-client.controller";
import { FetchClientsUseCase } from "@/domain/barbershop/application/use-cases/clients/fetch-clients";
import { GetClientByIdController } from "./controllers/client/find-client-by-id.controller";
import { FindClientByIdUseCase } from "@/domain/barbershop/application/use-cases/clients/find-client-by-id";
import { UpdateClientController } from "./controllers/client/update-client.controller";
import { UpdateClientUseCase } from "@/domain/barbershop/application/use-cases/clients/update-client";
import { UpdateClientRoleController } from "./controllers/barber/toggle-client-role.controller";
import { ToggleClientRole } from "@/domain/barbershop/application/use-cases/clients/toggle-client-role";

@Module({
  imports: [DatabaseModule, CryptographyModule, AuthModule],
  controllers: [
    CreateBarberAccountController,
    GetBarberByIdController,
    UpdateBarberController,
    AuthenticateBarberController,
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
    AuthenticateClientController,
    RegisterClientController,
    CompleteClientRegistrationController,
    VerifyMagicLinkController,
    DeleteClientController,
    FetchClientsController,
    GetClientByIdController,
    UpdateClientController,
    UpdateClientRoleController,
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
    RegisterClientWithMagicLinkUseCase,
    CompleteClientRegistrationUseCase,
    AuthenticateClientUseCase,
    DeleteClientUseCase,
    FetchClientsUseCase,
    FindClientByIdUseCase,
    UpdateClientUseCase,
    ToggleClientRole,
  ],
})
export class HttpModule {}
