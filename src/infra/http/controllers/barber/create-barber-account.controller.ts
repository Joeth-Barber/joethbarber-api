import {
  BadRequestException,
  ConflictException,
  HttpCode,
  UsePipes,
} from "@nestjs/common";
import { Body, Controller, Post } from "@nestjs/common";
import { z } from "zod";
import { Public } from "@/infra/auth/public";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { CreateBarberUseCase } from "@/domain/barbershop/application/use-cases/barber/create-barber";
import { EmailAlreadyExistsError } from "@/core/errors/email-already-exists";

const createAccountBodySchema = z.object({
  role: z.enum(["ADMIN", "EMPLOYEE"]),
  fullName: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller("/create/barber")
@Public()
export class CreateBarberAccountController {
  constructor(private createBarber: CreateBarberUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { role, fullName, email, password } = body;

    const result = await this.createBarber.execute({
      role,
      fullName,
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case EmailAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { accessToken } = result.value;

    return {
      access_token: accessToken,
      role: result.value.barber.role,
    };
  }
}
