import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from "@nestjs/common";
import { z } from "zod";
import { Public } from "@/infra/auth/public";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { WrongCredentialsError } from "@/core/errors/wrong-credentials";
import { AuthenticateBarberUseCase } from "@/domain/barbershop/application/use-cases/barber/authenticate-barber";

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller("/barber/sessions")
@Public()
export class AuthenticateController {
  constructor(private authenticateBarber: AuthenticateBarberUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body;

    const result = await this.authenticateBarber.execute({
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { accessToken } = result.value;

    return {
      access_token: accessToken,
    };
  }
}
