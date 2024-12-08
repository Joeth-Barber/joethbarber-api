import {
  BadRequestException,
  ConflictException,
  HttpCode,
  UsePipes,
} from "@nestjs/common";
import { Body, Controller, Post, Res } from "@nestjs/common";
import { Response } from "express";
import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { EmailAlreadyExistsError } from "@/core/errors/email-already-exists";
import { CompleteClientRegistrationUseCase } from "@/domain/barbershop/application/use-cases/clients/complete-client-registration";

const createClientBodySchema = z.object({
  fullName: z.string(),
  nickName: z.string(),
  phone: z.string(),
  cpf: z.string(),
  email: z.string().email(),
});

type CreateClientBodySchema = z.infer<typeof createClientBodySchema>;

@Controller("/complete-registration/client")
export class CompleteClientRegistrationController {
  constructor(
    private completeClientRegistration: CompleteClientRegistrationUseCase
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createClientBodySchema))
  async handle(@Body() body: CreateClientBodySchema, @Res() res: Response) {
    const { fullName, nickName, phone, email, cpf } = body;

    const result = await this.completeClientRegistration.execute({
      fullName,
      nickName,
      email,
      phone,
      cpf,
    });

    if (result.isRight()) {
      const { token, client } = result.value;

      return res.send({
        message: "Usuário registrado com sucesso!",
        authToken: token,
        clientInfos: {
          client_id: client.id.toString(),
          client_role: client.role,
          client_fullname: client.fullName,
          client_email: client.email,
        },
      });
    } else {
      const error = result.value;

      switch (error.constructor) {
        case EmailAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
