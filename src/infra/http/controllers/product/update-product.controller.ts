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
import { UpdateProductUseCase } from "@/domain/barbershop/application/use-cases/products/update-product";

const updateProductBodySchema = z.object({
  name: z.string().optional(),
  price: z.number().optional(),
  quantity: z.number().optional(),
});

type UpdateProductBodySchema = z.infer<typeof updateProductBodySchema>;

@Controller("/update/product/:productId")
export class UpdateProductController {
  constructor(private updateProduct: UpdateProductUseCase) {}

  @Put()
  async handle(
    @Body(new ZodValidationPipe(updateProductBodySchema))
    body: UpdateProductBodySchema,
    @Param("productId") productId: string
  ) {
    const { name, price, quantity } = body;

    const result = await this.updateProduct.execute({
      productId: new UniqueEntityId(productId),
      name,
      price,
      quantity,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
