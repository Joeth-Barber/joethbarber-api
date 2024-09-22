import { Injectable } from "@nestjs/common";
import { ProductsRepository } from "../../repositories/products-repository";
import { Either, left, right } from "@/core/either";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { BarbersRepository } from "../../repositories/barbers-repository";
import { NotAllowedError } from "@/core/errors/not-allowed";

interface DeleteProductUseCaseRequest {
  productId: UniqueEntityId;
  barberId: UniqueEntityId;
}

type DeleteProductUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>;

@Injectable()
export class DeleteProductUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private barbersRepository: BarbersRepository
  ) {}

  async execute({
    productId,
    barberId,
  }: DeleteProductUseCaseRequest): Promise<DeleteProductUseCaseResponse> {
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

    await this.productsRepository.delete(product);

    return right({});
  }
}
