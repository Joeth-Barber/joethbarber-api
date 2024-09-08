import { Either, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { Product } from "../../../enterprise/entities/product";
import { ProductsRepository } from "../../repositories/products-repository";

export interface CreateProductUseCaseRequest {
  name: string;
  price: number;
  quantity: number;
}

type CreateProductUseCaseResponse = Either<null, { product: Product }>;

@Injectable()
export class CreateProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    name,
    price,
    quantity,
  }: CreateProductUseCaseRequest): Promise<CreateProductUseCaseResponse> {
    const product = Product.create({
      name,
      price,
      quantity,
    });

    await this.productsRepository.create(product);

    return right({
      product,
    });
  }
}
