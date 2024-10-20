import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { BadRequestException, Controller, Get, Param } from "@nestjs/common";
import { FindServiceByIdUseCase } from "@/domain/barbershop/application/use-cases/services/find-service-by-id";
import { ServicePresenter } from "../../presenters/service-presenter";

@Controller("/find/service/:serviceId")
export class GetServiceByIdController {
  constructor(private getServiceById: FindServiceByIdUseCase) {}

  @Get()
  async handle(@Param("serviceId") serviceId: string) {
    const result = await this.getServiceById.execute({
      serviceId: new UniqueEntityId(serviceId),
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return {
      service: ServicePresenter.toHTTP(result.value.service),
    };
  }
}
