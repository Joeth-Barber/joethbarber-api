import { UseCaseError } from "@/core/errors/use-case-error";

export class WrongCredentialsError extends Error implements UseCaseError {
  constructor() {
    super(`E-mail ou senha inválidos, tente novamente.`);
  }
}
