import { Injectable } from "@nestjs/common";
import { ProductsRepository } from "../../repositories/products-repository";
import { Either, left, right } from "@/core/either";
import { Product } from "@/domain/barbershop/enterprise/entities/product";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

export interface FindProductByIdUseCaseRequest {
  productId: UniqueEntityId;
}

type FindProductByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  { product: Product }
>;

@Injectable()
export class FindProductByIdUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    productId,
  }: FindProductByIdUseCaseRequest): Promise<FindProductByIdUseCaseResponse> {
    const product = await this.productsRepository.findById(
      productId.toString()
    );

    if (!product) {
      return left(new ResourceNotFoundError());
    }

    return right({
      product,
    });
  }
}
