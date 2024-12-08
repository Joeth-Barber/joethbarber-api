import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { FetchClientBookingsUseCase } from "@/domain/barbershop/application/use-cases/booking/fetch-bookings-by-client-id";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { BookingPresenter } from "../../presenters/booking-presenter";

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQuerySchema = z.infer<typeof pageQueryParamSchema>;

@Controller("/find/client/:clientId/bookings")
export class FetchClientBookingsController {
  constructor(private fetchBookings: FetchClientBookingsUseCase) {}

  @Get()
  async handle(
    @Query("page", queryValidationPipe) page: PageQuerySchema,
    @Param("clientId") clientId: string
  ) {
    const result = await this.fetchBookings.execute({
      page,
      clientId: new UniqueEntityId(clientId),
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
