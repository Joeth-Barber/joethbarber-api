import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { BadRequestException, Controller, Param, Patch } from "@nestjs/common";
import { ToggleClientRole } from "@/domain/barbershop/application/use-cases/clients/toggle-client-role";

@Controller("/update/client/:clientId")
export class UpdateClientRoleController {
  constructor(private updateClientRole: ToggleClientRole) {}

  @Patch()
  async handle(@Param("clientId") clientId: string) {
    const result = await this.updateClientRole.execute({
      clientId: new UniqueEntityId(clientId),
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
