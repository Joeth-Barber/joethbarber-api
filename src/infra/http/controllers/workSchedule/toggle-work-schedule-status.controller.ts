import {
  BadRequestException,
  ConflictException,
  Param,
  Patch,
  UnauthorizedException,
  Body,
  Controller,
} from "@nestjs/common";
import { EmailAlreadyExistsError } from "@/core/errors/email-already-exists";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ToggleWorkScheduleStatusUseCase } from "@/domain/barbershop/application/use-cases/work-schedule/toggle-work-schedule-status";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";

const toggleWorkScheduleBodySchema = z.object({
  barberId: z.string().uuid(),
  allowClients: z.boolean().optional(),
});

type ToggleWorkScheduleBody = z.infer<typeof toggleWorkScheduleBodySchema>;

@Controller("/update/workSchedule/:workScheduleId")
export class ToggleWorkScheduleStatusController {
  constructor(private toggle: ToggleWorkScheduleStatusUseCase) {}

  @Patch()
  async handle(
    @Body(new ZodValidationPipe(toggleWorkScheduleBodySchema))
    body: ToggleWorkScheduleBody,
    @Param("workScheduleId") workScheduleId: string,
    @CurrentUser() user: UserPayload
  ) {
    const { barberId, allowClients } = body;

    if (barberId !== user.sub) {
      throw new UnauthorizedException();
    }

    const result = await this.toggle.execute({
      workScheduleId: new UniqueEntityId(workScheduleId),
      barberId: new UniqueEntityId(barberId),
      allowClients,
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
