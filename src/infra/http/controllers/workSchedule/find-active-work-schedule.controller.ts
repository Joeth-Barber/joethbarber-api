import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Controller, Get } from "@nestjs/common";
import { AvailableDaysPresenter } from "../../presenters/work-day-presenter";
import { FindActiveWorkScheduleUseCase } from "@/domain/barbershop/application/use-cases/work-schedule/find-active-work-schedule";

@Controller("/find/workSchedule")
export class FindActiveWorkScheduleController {
  constructor(private findActiveWorkSchedule: FindActiveWorkScheduleUseCase) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const result = await this.findActiveWorkSchedule.execute({
      clientId: new UniqueEntityId(user.sub),
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const { workScheduleId, availableDaysAndHours } = result.value;

    return {
      workSchedule: AvailableDaysPresenter.toHTTP(
        workScheduleId,
        availableDaysAndHours
      ),
    };
  }
}
