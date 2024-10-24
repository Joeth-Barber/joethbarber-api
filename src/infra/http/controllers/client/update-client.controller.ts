import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  BadRequestException,
  Controller,
  Put,
  Param,
  Body,
  UnauthorizedException,
} from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { UpdateClientUseCase } from "@/domain/barbershop/application/use-cases/clients/update-client";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";

const updateClientBodySchema = z.object({
  fullName: z.string().optional(),
  nickName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  billingDay: z.number().optional(),
});

type UpdateClientBodySchema = z.infer<typeof updateClientBodySchema>;

@Controller("/update/client/:clientId")
export class UpdateClientController {
  constructor(private updateClient: UpdateClientUseCase) {}

  @Put()
  async handle(
    @Body(new ZodValidationPipe(updateClientBodySchema))
    body: UpdateClientBodySchema,
    @Param("clientId") clientId: string,
    @CurrentUser() user: UserPayload
  ) {
    if (clientId !== user.sub) {
      throw new UnauthorizedException();
    }

    const { fullName, nickName, phone, email, billingDay } = body;

    const result = await this.updateClient.execute({
      clientId: new UniqueEntityId(clientId),
      fullName,
      nickName,
      phone,
      email,
      billingDay,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
