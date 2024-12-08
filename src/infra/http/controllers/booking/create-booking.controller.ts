import {
  BadRequestException,
  ConflictException,
  HttpCode,
  UnauthorizedException,
  Body,
  Controller,
  Post,
} from "@nestjs/common";
import { EmailAlreadyExistsError } from "@/core/errors/email-already-exists";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { CreateBookingUseCase } from "@/domain/barbershop/application/use-cases/booking/create-booking";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";

const createBookingBodySchema = z.object({
  clientId: z.string().uuid(),
  workScheduleId: z.string().uuid(),
  date: z
    .string()
    .refine((dateString) => !isNaN(new Date(dateString).getTime()), {
      message: "Invalid date format.",
    }),
  services: z.array(z.object({ id: z.string().uuid() })).optional(),
  products: z.array(z.object({ id: z.string().uuid() })).optional(),
  description: z.string().optional(),
  status: z.enum(["PENDING", "COMPLETED", "CANCELED"]).optional(),
});

type CreateBookingBody = z.infer<typeof createBookingBodySchema>;

@Controller("/create/booking")
export class CreateBookingController {
  constructor(private createBooking: CreateBookingUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(createBookingBodySchema))
    body: CreateBookingBody,
    @CurrentUser() user: UserPayload
  ) {
    const {
      clientId,
      workScheduleId,
      date: dateString,
      services,
      products,
      description,
      status,
    } = body;

    if (clientId !== user.sub) {
      throw new UnauthorizedException();
    }

    const date = new Date(dateString);

    const result = await this.createBooking.execute({
      clientId: new UniqueEntityId(clientId),
      workScheduleId: new UniqueEntityId(workScheduleId),
      date,
      services,
      products,
      description,
      status,
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
