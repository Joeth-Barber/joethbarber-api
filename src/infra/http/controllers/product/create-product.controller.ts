import { BadRequestException, HttpCode, UsePipes } from "@nestjs/common";
import { Body, Controller, Post } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { CreateProductUseCase } from "@/domain/barbershop/application/use-cases/products/create-product";

const createProductBodySchema = z.object({
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
});

type CreateProductBodySchema = z.infer<typeof createProductBodySchema>;

@Controller("/create/product")
export class CreateProductController {
  constructor(private createProduct: CreateProductUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createProductBodySchema))
  async handle(@Body() body: CreateProductBodySchema) {
    const { name, price, quantity } = body;

    const result = await this.createProduct.execute({
      name,
      price,
      quantity,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
