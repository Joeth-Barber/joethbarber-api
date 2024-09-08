import { Injectable } from "@nestjs/common";
import { ProductsRepository } from "../../repositories/products-repository";
import { Either, left, right } from "@/core/either";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface DeleteProductUseCaseRequest {
  productId: UniqueEntityId;
}

type DeleteProductUseCaseResponse = Either<ResourceNotFoundError, {}>;

@Injectable()
export class DeleteProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    productId,
  }: DeleteProductUseCaseRequest): Promise<DeleteProductUseCaseResponse> {
    const product = await this.productsRepository.findById(
      productId.toString()
    );

    if (!product) {
      return left(new ResourceNotFoundError());
    }

    await this.productsRepository.delete(product);

    return right({});
  }
}
