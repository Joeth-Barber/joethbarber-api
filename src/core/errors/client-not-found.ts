import { UseCaseError } from "./use-case-error";

export class ClientNotFoundError extends Error implements UseCaseError {
  constructor() {
    super("Este cliente não foi encontrado.");
  }
}
