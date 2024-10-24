import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UsePipes,
} from "@nestjs/common";
import { z } from "zod";
import { Public } from "@/infra/auth/public";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { RegisterClientWithMagicLinkUseCase } from "@/domain/barbershop/application/use-cases/clients/register-client-with-magic-link";
import { EmailAlreadyExistsError } from "@/core/errors/email-already-exists";

const registerBodySchema = z.object({
  email: z.string().email(),
});

type RegisterBodySchema = z.infer<typeof registerBodySchema>;

@Controller("/create/client")
@Public()
export class RegisterClientController {
  constructor(
    private readonly registerClient: RegisterClientWithMagicLinkUseCase
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(registerBodySchema))
  async handle(@Body() body: RegisterBodySchema) {
    const { email } = body;

    const result = await this.registerClient.execute({ email });

    if (result.isLeft()) {
      const error = result.value;

      if (error instanceof EmailAlreadyExistsError) {
        throw new BadRequestException(
          "Este endereço de e-mail já está sendo utilizado."
        );
      }

      throw new BadRequestException("Failed to send magic link");
    }

    return { message: "Um link de acesso foi enviado para o seu e-mail!" };
  }
}
