import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  BadRequestException,
  Controller,
  Put,
  Param,
  Body,
} from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { UpdateBarberUseCase } from "@/domain/barbershop/application/use-cases/barber/update-barber";

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
    @Param("barberId") barberId: string
  ) {
    const { role, fullName, email, password } = body;

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
