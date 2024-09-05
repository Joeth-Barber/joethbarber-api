import { UseCaseError } from "./use-case-error";

export class EmailAlreadyExistsError extends Error implements UseCaseError {
  constructor() {
    super("Este endereço de e-mail já está sendo utilizado.");
  }
}
