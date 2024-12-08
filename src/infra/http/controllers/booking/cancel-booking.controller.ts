import {
  BadRequestException,
  ConflictException,
  Body,
  Controller,
  Patch,
  UsePipes,
  Param,
} from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { CancelBookingUseCase } from "@/domain/barbershop/application/use-cases/booking/cancel-booking";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { EmailAlreadyExistsError } from "@/core/errors/email-already-exists";

const cancelBookingBodySchema = z.object({
  clientId: z.string().uuid(),
});

type CancelBookingBody = z.infer<typeof cancelBookingBodySchema>;

@Controller("/cancel/booking/:bookingId")
export class CancelBookingController {
  constructor(private cancelBooking: CancelBookingUseCase) {}

  @Patch()
  async handle(
    @Body(new ZodValidationPipe(cancelBookingBodySchema))
    body: CancelBookingBody,
    @Param("bookingId") bookingId: string
  ) {
    const { clientId } = body;

    const result = await this.cancelBooking.execute({
      clientId: new UniqueEntityId(clientId),
      bookingId: new UniqueEntityId(bookingId),
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case EmailAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
