import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { BadRequestException, Controller, Get, Param } from "@nestjs/common";
import { FindProductByIdUseCase } from "@/domain/barbershop/application/use-cases/products/find-product-by-id";
import { ProductPresenter } from "../../presenters/product-presenter";

@Controller("/find/product/:productId")
export class GetProductByIdController {
  constructor(private getProductById: FindProductByIdUseCase) {}

  @Get()
  async handle(@Param("productId") productId: string) {
    const result = await this.getProductById.execute({
      productId: new UniqueEntityId(productId),
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return {
      product: ProductPresenter.toHTTP(result.value.product),
    };
  }
}
