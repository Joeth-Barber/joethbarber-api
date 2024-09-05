import { UseCaseError } from "./use-case-error";

export class CpfAlreadyExistsError extends Error implements UseCaseError {
  constructor() {
    super("Este CPF já foi cadastrado.");
  }
}
