import { Controller, BadRequestException, Param, Delete } from "@nestjs/common";
import { DeleteServiceUseCase } from "@/domain/barbershop/application/use-cases/services/delete-service";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

@Controller("/delete/service/:serviceId")
export class DeleteServiceController {
  constructor(private deleteService: DeleteServiceUseCase) {}

  @Delete()
  async handle(@Param("serviceId") serviceId: string) {
    const result = await this.deleteService.execute({
      serviceId: new UniqueEntityId(serviceId),
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
