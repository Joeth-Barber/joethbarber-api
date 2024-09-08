import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { DeleteProductUseCase } from "./delete-product";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeProduct } from "test/factories/make-product";

let inMemoryProductsRepository: InMemoryProductsRepository;
let sut: DeleteProductUseCase;

describe("Delete Product", () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    sut = new DeleteProductUseCase(inMemoryProductsRepository);
  });

  it("should be able to delete a product", async () => {
    const product = makeProduct({}, new UniqueEntityId("product-01"));
    inMemoryProductsRepository.create(product);
    expect(inMemoryProductsRepository.items).toHaveLength(1);

    const result = await sut.execute({
      productId: new UniqueEntityId("product-01"),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryProductsRepository.items).toHaveLength(0);
  });
});
