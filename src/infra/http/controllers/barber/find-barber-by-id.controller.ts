import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { FindBarberByIdUseCase } from "@/domain/barbershop/application/use-cases/barber/find-barber-by-id";
import { BadRequestException, Controller, Get, Param } from "@nestjs/common";
import { BarberPresenter } from "../../presenters/barber-presenter";

@Controller("/find/barber/:barberId")
export class GetBarberByIdController {
  constructor(private getBarberById: FindBarberByIdUseCase) {}

  @Get()
  async handle(@Param("barberId") barberId: string) {
    const result = await this.getBarberById.execute({
      barberId: new UniqueEntityId(barberId),
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return {
      barber: BarberPresenter.toHTTP(result.value.barber),
    };
  }
}
