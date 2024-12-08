import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { BadRequestException, Controller, Get, Param } from "@nestjs/common";
import { BookingPresenter } from "../../presenters/booking-presenter";
import { FindBookingByIdUseCase } from "@/domain/barbershop/application/use-cases/booking/find-booking-by-id";

@Controller("/find/booking/:bookingId")
export class GetBookingByIdController {
  constructor(private getBookingById: FindBookingByIdUseCase) {}

  @Get()
  async handle(@Param("bookingId") bookingId: string) {
    const result = await this.getBookingById.execute({
      bookingId: new UniqueEntityId(bookingId),
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return {
      booking: BookingPresenter.toHTTP(result.value.booking),
    };
  }
}
