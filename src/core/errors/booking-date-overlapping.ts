import { UseCaseError } from "./use-case-error";

export class BookingDateOverlappingError extends Error implements UseCaseError {
  constructor() {
    super("Este horário já foi reservado por outro cliente.");
  }
}
