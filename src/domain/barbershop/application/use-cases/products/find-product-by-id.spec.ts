import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { makeProduct } from "test/factories/make-product";
import { FindProductByIdUseCase } from "./find-product-by-id";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

let inMemoryProductsRepository: InMemoryProductsRepository;
let sut: FindProductByIdUseCase;

describe("Find Products By Id", () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    sut = new FindProductByIdUseCase(inMemoryProductsRepository);
  });

  it("should be able to find a product by id", async () => {
    await inMemoryProductsRepository.create(
      makeProduct(
        {
          name: "Pomada modeladora",
        },
        new UniqueEntityId("product-01")
      )
    );

    await inMemoryProductsRepository.create(
      makeProduct(
        {
          name: "Coca-cola 400ml",
        },
        new UniqueEntityId("product-02")
      )
    );

    expect(inMemoryProductsRepository.items).toHaveLength(2);

    const result = await sut.execute({
      productId: new UniqueEntityId("product-02"),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      product: expect.objectContaining({ name: "Coca-cola 400ml" }),
    });
  });
});
