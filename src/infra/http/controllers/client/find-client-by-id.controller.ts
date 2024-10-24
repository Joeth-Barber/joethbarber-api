import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { BadRequestException, Controller, Get, Param } from "@nestjs/common";
import { FindClientByIdUseCase } from "@/domain/barbershop/application/use-cases/clients/find-client-by-id";
import { ClientPresenter } from "../../presenters/client-presenter";

@Controller("/find/client/:clientId")
export class GetClientByIdController {
  constructor(private getClientById: FindClientByIdUseCase) {}

  @Get()
  async handle(@Param("clientId") clientId: string) {
    const result = await this.getClientById.execute({
      clientId: new UniqueEntityId(clientId),
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return {
      client: ClientPresenter.toHTTP(result.value.client),
    };
  }
}
