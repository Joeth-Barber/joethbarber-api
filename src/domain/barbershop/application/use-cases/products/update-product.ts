import { Injectable } from "@nestjs/common";
import { ProductsRepository } from "../../repositories/products-repository";
import { Either, left, right } from "@/core/either";
import { Product } from "../../../enterprise/entities/product";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface UpdateProductUseCaseRequest {
  productId: UniqueEntityId;
  name: string;
  price: string;
  quantity: number;
}

type UpdateProductUseCaseResponse = Either<
  ResourceNotFoundError,
  { product: Product }
>;

@Injectable()
export class UpdateProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    productId,
    name,
    price,
    quantity,
  }: UpdateProductUseCaseRequest): Promise<UpdateProductUseCaseResponse> {
    const product = await this.productsRepository.findById(
      productId.toString()
    );

    if (!product) {
      return left(new ResourceNotFoundError());
    }

    product.name = name;
    product.price = price;
    product.quantity = quantity;

    await this.productsRepository.save(product);

    return right({ product });
  }
}
