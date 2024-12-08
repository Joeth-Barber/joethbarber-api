import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  BadRequestException,
  Controller,
  Put,
  Param,
  Body,
} from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { UpdateBookingUseCase } from "@/domain/barbershop/application/use-cases/booking/update-booking";

const updateBookingBodySchema = z.object({
  newDate: z
    .string()
    .refine(
      (date) => !isNaN(new Date(date).getTime()),
      "Invalid datetime format"
    )
    .optional(),
  products: z.array(z.object({ id: z.string() })).optional(),
  services: z.array(z.object({ id: z.string() })).optional(),
  description: z.string().optional(),
  totalPrice: z.number().optional(),
});

type UpdateBookingBodySchema = z.infer<typeof updateBookingBodySchema>;

@Controller("/update/booking/:bookingId")
export class UpdateBookingController {
  constructor(private updateBooking: UpdateBookingUseCase) {}

  @Put()
  async handle(
    @Body(new ZodValidationPipe(updateBookingBodySchema))
    body: UpdateBookingBodySchema,
    @Param("bookingId") bookingId: string
  ) {
    const { newDate, products, services, description, totalPrice } = body;

    const parsedDate = newDate ? new Date(newDate) : null;
    if (newDate && isNaN(parsedDate!.getTime())) {
      throw new BadRequestException("Invalid date format");
    }

    const result = await this.updateBooking.execute({
      bookingId: new UniqueEntityId(bookingId),
      newDate: parsedDate ?? undefined,
      products,
      services,
      description,
      totalPrice,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
