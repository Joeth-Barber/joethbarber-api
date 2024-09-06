import { Injectable } from "@nestjs/common";
import { ProductsRepository } from "../../repositories/products-repository";
import { Either, right } from "@/core/either";
import { Product } from "@/domain/barbershop/enterprise/entities/product";

export interface FetchProductsUseCaseRequest {
  page: number;
}

type FetchProductsUseCaseResponse = Either<null, { products: Product[] }>;

@Injectable()
export class FetchProductsUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    page,
  }: FetchProductsUseCaseRequest): Promise<FetchProductsUseCaseResponse> {
    const products = await this.productsRepository.findMany({ page });

    return right({
      products,
    });
  }
}
