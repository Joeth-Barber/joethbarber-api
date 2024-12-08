import { UseCaseError } from "./use-case-error";

export class PhoneAlreadyExistsError extends Error implements UseCaseError {
  constructor() {
    super("Este Celular já está sendo utilizado.");
  }
}
