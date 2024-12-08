import {
  Controller,
  BadRequestException,
  Param,
  Delete,
  HttpCode,
} from "@nestjs/common";
import { DeleteClientUseCase } from "@/domain/barbershop/application/use-cases/clients/delete-client";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

@Controller("/delete/client/:clientId")
export class DeleteClientController {
  constructor(private deleteClient: DeleteClientUseCase) {}

  @Delete()
  @HttpCode(200)
  async handle(@Param("clientId") clientId: string) {
    const result = await this.deleteClient.execute({
      clientId: new UniqueEntityId(clientId),
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
