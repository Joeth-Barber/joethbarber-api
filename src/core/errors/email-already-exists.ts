import { UseCaseError } from "./use-case-error";

export class EmailAlreadyExistsError extends Error implements UseCaseError {
  constructor() {
    super("Este E-mail já está sendo utilizado.");
  }
}
