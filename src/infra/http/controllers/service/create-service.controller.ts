import { BadRequestException, HttpCode, UsePipes } from "@nestjs/common";
import { Body, Controller, Post } from "@nestjs/common";
import { z } from "zod";
import { Public } from "@/infra/auth/public";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { CreateServiceUseCase } from "@/domain/barbershop/application/use-cases/services/create-service";

const createServiceBodySchema = z.object({
  name: z.string(),
  price: z.number(),
});

type CreateServiceBodySchema = z.infer<typeof createServiceBodySchema>;

@Controller("/create/service")
export class CreateServiceController {
  constructor(private createService: CreateServiceUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createServiceBodySchema))
  async handle(@Body() body: CreateServiceBodySchema) {
    const { name, price } = body;

    const result = await this.createService.execute({
      name,
      price,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
