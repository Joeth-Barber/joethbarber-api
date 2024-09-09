import { UseCaseError } from "./use-case-error";

export class NotAllowedError extends Error implements UseCaseError {
  constructor() {
    super("Você não tem permissão para concluir esta ação.");
  }
}
