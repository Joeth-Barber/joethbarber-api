import { UseCaseError } from "./use-case-error";

export class BookingTooCloseToStartError extends Error implements UseCaseError {
  constructor() {
    super(
      "O agendamento só pode ser cancelado até 3 horas antes de horário reservado."
    );
  }
}
