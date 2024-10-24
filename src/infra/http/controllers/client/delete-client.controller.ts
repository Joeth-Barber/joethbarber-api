import {
  Controller,
  BadRequestException,
  Param,
  Delete,
  UnauthorizedException,
} from "@nestjs/common";
import { DeleteClientUseCase } from "@/domain/barbershop/application/use-cases/clients/delete-client";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";

@Controller("/delete/client/:clientId")
export class DeleteClientController {
  constructor(private deleteClient: DeleteClientUseCase) {}

  @Delete()
  async handle(
    @Param("clientId") clientId: string,
    @CurrentUser() user: UserPayload
  ) {
    if (clientId !== user.sub) {
      throw new UnauthorizedException();
    }

    const result = await this.deleteClient.execute({
      clientId: new UniqueEntityId(clientId),
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
