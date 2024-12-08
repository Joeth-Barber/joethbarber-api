import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { BookingPresenter } from "../../presenters/booking-presenter";
import { FetchBookingsUseCase } from "@/domain/barbershop/application/use-cases/booking/fetch-bookings";

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQuerySchema = z.infer<typeof pageQueryParamSchema>;

@Controller("/find/booking")
export class FetchBookingsController {
  constructor(private fetchBookings: FetchBookingsUseCase) {}

  @Get()
  async handle(@Query("page", queryValidationPipe) page: PageQuerySchema) {
    const result = await this.fetchBookings.execute({
      page,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const bookings = result.value.bookings;

    return {
      bookings: bookings.map(BookingPresenter.toHTTP),
    };
  }
}
