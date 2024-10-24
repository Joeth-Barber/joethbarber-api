import { Injectable } from "@nestjs/common";
import { ClientsRepository } from "../../repositories/clients-repository";
import { AuthService } from "@/infra/auth/auth.service";
import { Either, left, right } from "@/core/either";
import { EmailAlreadyExistsError } from "@/core/errors/email-already-exists";
import { v4 as uuidv4 } from "uuid";

interface RegisterClientWithMagicLinkRequest {
  email: string;
}

type RegisterClientWithMagicLinkResponse = Either<EmailAlreadyExistsError, {}>;

@Injectable()
export class RegisterClientWithMagicLinkUseCase {
  constructor(
    private clientsRepository: ClientsRepository,
    private authService: AuthService
  ) {}

  async execute({
    email,
  }: RegisterClientWithMagicLinkRequest): Promise<RegisterClientWithMagicLinkResponse> {
    const emailExists = await this.clientsRepository.findByEmail(email);
    if (emailExists) return left(new EmailAlreadyExistsError());

    const tempId = uuidv4();
    const token = this.authService.generateMagicLinkToken(email, tempId);
    await this.authService.sendMagicLink(email, token);

    return right({});
  }
}
