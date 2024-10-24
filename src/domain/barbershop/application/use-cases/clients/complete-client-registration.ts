import { Injectable } from "@nestjs/common";
import { ClientsRepository } from "../../repositories/clients-repository";
import { Either, left, right } from "@/core/either";
import { Client } from "../../../enterprise/entities/client";
import { EmailAlreadyExistsError } from "@/core/errors/email-already-exists";
import { CpfAlreadyExistsError } from "@/core/errors/cpf-already-exists";
import { PhoneAlreadyExistsError } from "@/core/errors/phone-already-exists";
import { AuthService } from "@/infra/auth/auth.service";

interface CreateClientUseCaseRequest {
  fullName: string;
  nickName: string;
  phone: string;
  cpf: string;
  email: string;
}

type CreateClientUseCaseResponse = Either<
  EmailAlreadyExistsError | PhoneAlreadyExistsError | CpfAlreadyExistsError,
  { client: Client; token: string }
>;

@Injectable()
export class CompleteClientRegistrationUseCase {
  constructor(
    private clientsRepository: ClientsRepository,
    private authService: AuthService
  ) {}

  async execute({
    fullName,
    nickName,
    phone,
    cpf,
    email
  }: CreateClientUseCaseRequest): Promise<CreateClientUseCaseResponse> {
    const formattedCpf = this.formatCpf(cpf);
    const formattedPhone = this.formatPhone(phone);

    const phoneAlreadyExists = await this.clientsRepository.findByPhone(
      formattedPhone
    );
    if (phoneAlreadyExists) return left(new PhoneAlreadyExistsError());

    const cpfAlreadyExists = await this.clientsRepository.findByCpf(
      formattedCpf
    );
    if (cpfAlreadyExists) return left(new CpfAlreadyExistsError());

    const emailAlreadyExists = await this.clientsRepository.findByEmail(email);
    if (emailAlreadyExists) return left(new EmailAlreadyExistsError());

    const client = Client.create({
      fullName,
      nickName,
      phone: formattedPhone,
      cpf: formattedCpf,
      email,
    });

    await this.clientsRepository.create(client);

    const token = this.authService.generateMagicLinkToken(
      email,
      client.id.toString()
    );

    return right({ client, token });
  }

  private formatCpf(cpf: string): string {
    const digitsOnly = cpf.replace(/\D/g, "");
    return digitsOnly.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  private formatPhone(phone: string): string {
    const digitsOnly = phone.replace(/\D/g, "");
    return digitsOnly.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
}
