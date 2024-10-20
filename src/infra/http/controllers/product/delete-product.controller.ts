import { Controller, BadRequestException, Param, Delete } from "@nestjs/common";
import { DeleteProductUseCase } from "@/domain/barbershop/application/use-cases/products/delete-product";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

@Controller("/delete/product/:productId")
export class DeleteProductController {
  constructor(private deleteProduct: DeleteProductUseCase) {}

  @Delete()
  async handle(@Param("productId") productId: string) {
    const result = await this.deleteProduct.execute({
      productId: new UniqueEntityId(productId),
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
