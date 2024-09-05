import { UseCaseError } from "./use-case-error";

export class PhoneAlreadyExistsError extends Error implements UseCaseError {
  constructor() {
    super("Este número de telefone já está sendo utilizado.");
  }
}
