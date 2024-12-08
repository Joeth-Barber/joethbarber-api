import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { FetchAvailableDaysAndHoursUseCase } from "@/domain/barbershop/application/use-cases/work-schedule/list-available-days-and-hours";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Controller, Get, Param } from "@nestjs/common";
import { AvailableDaysPresenter } from "../../presenters/work-day-presenter";

@Controller("/find/workSchedule/:workScheduleId")
export class ListAvailableDaysAndHoursController {
  constructor(
    private fetchAvailableDaysAndHours: FetchAvailableDaysAndHoursUseCase
  ) {}

  @Get()
  async handle(
    @Param("workScheduleId") workScheduleId: string,
    @CurrentUser() user: UserPayload
  ) {
    const result = await this.fetchAvailableDaysAndHours.execute({
      workScheduleId: new UniqueEntityId(workScheduleId),
      clientId: new UniqueEntityId(user.sub),
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return {
      workSchedule: AvailableDaysPresenter.toHTTP(
        workScheduleId,
        result.value.availableDaysAndHours
      ),
    };
  }
}
