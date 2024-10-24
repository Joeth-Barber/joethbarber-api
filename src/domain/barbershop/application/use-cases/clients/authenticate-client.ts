import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { WrongCredentialsError } from "@/core/errors/wrong-credentials";
import { ClientsRepository } from "../../repositories/clients-repository";
import { AuthService } from "@/infra/auth/auth.service";

interface AuthenticateClientUseCaseRequest {
  email: string;
}

type AuthenticateClientUseCaseResponse = Either<WrongCredentialsError, {}>;

@Injectable()
export class AuthenticateClientUseCase {
  constructor(
    private readonly clientsRepository: ClientsRepository,
    private readonly authService: AuthService
  ) {}

  async execute({
    email,
  }: AuthenticateClientUseCaseRequest): Promise<AuthenticateClientUseCaseResponse> {
    const client = await this.clientsRepository.findByEmail(email);

    if (!client) {
      return left(new WrongCredentialsError());
    }

    const magicLinkToken = this.authService.generateMagicLinkToken(
      client.email,
      client.id.toString()
    );
    await this.authService.sendMagicLink(client.email, magicLinkToken);

    return right({});
  }
}
