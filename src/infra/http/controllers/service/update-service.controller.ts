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
import { UpdateServiceUseCase } from "@/domain/barbershop/application/use-cases/services/update-service";

const UpdateServiceBodySchema = z.object({
  name: z.string().optional(),
  price: z.number().optional(),
});

type UpdateServiceBodySchema = z.infer<typeof UpdateServiceBodySchema>;

@Controller("/update/service/:serviceId")
export class UpdateServiceController {
  constructor(private updateService: UpdateServiceUseCase) {}

  @Put()
  async handle(
    @Body(new ZodValidationPipe(UpdateServiceBodySchema))
    body: UpdateServiceBodySchema,
    @Param("serviceId") serviceId: string
  ) {
    const { name, price } = body;

    const result = await this.updateService.execute({
      serviceId: new UniqueEntityId(serviceId),
      name,
      price,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
