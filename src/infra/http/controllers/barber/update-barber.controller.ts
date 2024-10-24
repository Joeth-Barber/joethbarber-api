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
import { UpdateBarberUseCase } from "@/domain/barbershop/application/use-cases/barber/update-barber";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { CurrentUser } from "@/infra/auth/current-user-decorator";

const UpdateBarberBodySchema = z.object({
  role: z.enum(["ADMIN", "EMPLOYEE"]).optional(),
  fullName: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
});

type UpdateBarberBodySchema = z.infer<typeof UpdateBarberBodySchema>;

@Controller("/update/barber/:barberId")
export class UpdateBarberController {
  constructor(private updateBarber: UpdateBarberUseCase) {}

  @Put()
  async handle(
    @Body(new ZodValidationPipe(UpdateBarberBodySchema))
    body: UpdateBarberBodySchema,
    @Param("barberId") barberId: string,
    @CurrentUser() user: UserPayload
  ) {
    const { role, fullName, email, password } = body;

    if (barberId && barberId !== user.sub) {
      throw new UnauthorizedException();
    }

    const result = await this.updateBarber.execute({
      barberId: new UniqueEntityId(barberId),
      role,
      fullName,
      email,
      password,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
