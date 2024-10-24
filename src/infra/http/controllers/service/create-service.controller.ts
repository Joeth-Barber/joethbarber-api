import { BadRequestException, HttpCode, UseGuards } from "@nestjs/common";
import { Body, Controller, Post } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { CreateServiceUseCase } from "@/domain/barbershop/application/use-cases/services/create-service";
import { JwtAuthGuard } from "@/infra/auth/jwt-auth.guard";

const createServiceBodySchema = z.object({
  name: z.string(),
  price: z.number(),
});

type CreateServiceBodySchema = z.infer<typeof createServiceBodySchema>;

@Controller("/create/service")
@UseGuards(JwtAuthGuard)
export class CreateServiceController {
  constructor(private createService: CreateServiceUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(createServiceBodySchema))
    body: CreateServiceBodySchema
  ) {
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
