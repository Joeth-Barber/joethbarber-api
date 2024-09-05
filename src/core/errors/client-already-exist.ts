import { UseCaseError } from "./use-case-error";

export class ClientAlreadyExistError extends Error implements UseCaseError {
  constructor() {
    super("Client already exists.");
  }
}
