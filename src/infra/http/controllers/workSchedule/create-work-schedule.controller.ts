import {
  BadRequestException,
  ConflictException,
  HttpCode,
  UsePipes,
} from "@nestjs/common";
import { Body, Controller, Post } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { EmailAlreadyExistsError } from "@/core/errors/email-already-exists";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { CreateWorkScheduleUseCase } from "@/domain/barbershop/application/use-cases/work-schedule/create-work-schedule";

const Breakschema = z.object({
  title: z.string(),
  startTime: z.string(),
  endTime: z.string(),
});

const WorkDaysSchema = z.object({
  dayOfWeek: z.number(), // Representa o dia da semana (0 - 6)
  date: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Data inválida, deve ser no formato YYYY-MM-DD"
    ), // Validação para o formato da data
  startTime: z.string(), // HH:mm
  endTime: z.string(), // HH:mm
  breaks: z.array(Breakschema).optional(),
});

const createBodySchema = z.object({
  barberId: z.string(),
  workDays: z.array(WorkDaysSchema),
});

type CreateBodySchema = z.infer<typeof createBodySchema>;

@Controller("/create/workSchedule")
export class CreateWorkScheduleController {
  constructor(private createWorkSchedule: CreateWorkScheduleUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createBodySchema))
  async handle(@Body() body: CreateBodySchema) {
    const { barberId, workDays } = body;

    const result = await this.createWorkSchedule.execute({
      barberId: new UniqueEntityId(barberId),
      workDays,
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
