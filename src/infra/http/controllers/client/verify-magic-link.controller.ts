import {
  Controller,
  Get,
  Query,
  Res,
  UnauthorizedException,
} from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "@/infra/auth/auth.service";
import { ClientsRepository } from "@/domain/barbershop/application/repositories/clients-repository";
import { Public } from "@/infra/auth/public";

@Controller("/client/sessions/verify")
export class VerifyMagicLinkController {
  constructor(
    private readonly authService: AuthService,
    private readonly clientsRepository: ClientsRepository
  ) {}

  @Get()
  @Public()
  async verifyMagicLink(@Query("token") token: string, @Res() res: Response) {
    if (!token) {
      throw new UnauthorizedException("Token is required");
    }

    const { email } = this.authService.verifyMagicLinkToken(token);
    const client = await this.clientsRepository.findByEmail(email);

    if (client) {
      return res.status(200).send({
        action: "authenticate",
        message: "Usuário autenticado com sucesso!",
        authToken: token, // Retorna o token
        clientInfos: {
          client_id: client.id.toString(),
          client_role: client.role,
          client_fullname: client.fullName,
          client_email: client.email,
        },
      });
    } else {
      return res.status(200).send({
        action: "redirect",
        message: "Redirect to complete registration",
        authToken: token,
        email,
      });
    }
  }
}
