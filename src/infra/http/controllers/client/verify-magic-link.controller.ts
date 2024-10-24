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

    res.cookie("auth_token", JSON.stringify({ token }), {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 72, // 3 dias
    });

    const client = await this.clientsRepository.findByEmail(email);

    if (client) {
      res.cookie(
        "client_infos",
        JSON.stringify({
          client_id: client.id.toString(),
          client_role: client.role,
          client_email: client.email,
        }),
        {
          httpOnly: false,
          maxAge: 1000 * 60 * 60 * 72, // 3 dias
          sameSite: "lax",
        }
      );
    } else {
      return res.status(302).send({
        message: "Redirect to complete registration",
      });
    }

    return res.status(200).send({
      message: "Usuário autenticado com sucesso!",
    });
  }
}
