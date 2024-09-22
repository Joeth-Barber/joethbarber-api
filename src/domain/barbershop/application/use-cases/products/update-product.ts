import { Injectable } from "@nestjs/common";
import { ProductsRepository } from "../../repositories/products-repository";
import { Either, left, right } from "@/core/either";
import { Product } from "../../../enterprise/entities/product";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { BarbersRepository } from "../../repositories/barbers-repository";
import { NotAllowedError } from "@/core/errors/not-allowed";

interface UpdateProductUseCaseRequest {
  productId: UniqueEntityId;
  barberId: UniqueEntityId;
  name: string;
  price: number;
  quantity: number;
}

type UpdateProductUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { product: Product }
>;

@Injectable()
export class UpdateProductUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private barbersRepository: BarbersRepository
  ) {}

  async execute({
    productId,
    barberId,
    name,
    price,
    quantity,
  }: UpdateProductUseCaseRequest): Promise<UpdateProductUseCaseResponse> {
    const barber = await this.barbersRepository.findById(barberId.toString());

    if (!barber) {
      return left(new ResourceNotFoundError());
    }

    if (barber.role !== "ADMIN") {
      return left(new NotAllowedError());
    }

    const product = await this.productsRepository.findById(
      productId.toString()
    );

    if (!product) {
      return left(new ResourceNotFoundError());
    }

    if (name && product.name !== name) product.name = name;

    if (price && product.price !== price) product.price = price;

    if (quantity && product.quantity !== quantity) product.quantity = quantity;

    await this.productsRepository.save(product);

    return right({ product });
  }
}
