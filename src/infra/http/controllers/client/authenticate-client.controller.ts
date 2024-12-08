import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from "@nestjs/common";
import { z } from "zod";
import { Public } from "@/infra/auth/public";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { WrongCredentialsError } from "@/core/errors/wrong-credentials";
import { AuthenticateClientUseCase } from "@/domain/barbershop/application/use-cases/clients/authenticate-client";

const authenticateBodySchema = z.object({
  email: z.string().email(),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller("/client/sessions")
@Public()
export class AuthenticateClientController {
  constructor(private readonly authenticateClient: AuthenticateClientUseCase) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email } = body;

    const result = await this.authenticateClient.execute({ email });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return {
      message: "Um link de acesso foi enviado para o seu e-mail!",
    };
  }
}
