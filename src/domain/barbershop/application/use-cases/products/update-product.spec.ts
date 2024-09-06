import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { makeProduct } from "test/factories/make-product";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { UpdateProductUseCase } from "./update-product";

let inMemoryProductsRepository: InMemoryProductsRepository;
let sut: UpdateProductUseCase;

describe("Update Product", () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    sut = new UpdateProductUseCase(inMemoryProductsRepository);
  });

  it("should be able to update a product", async () => {
    await inMemoryProductsRepository.create(
      makeProduct(
        {
          name: "Cerveja Skol",
          price: "R$ 5,00",
          quantity: 10,
        },
        new UniqueEntityId("product-01")
      )
    );
    expect(inMemoryProductsRepository.items).toHaveLength(1);

    const result = await sut.execute({
      productId: new UniqueEntityId("product-01"),
      name: "Cerveja Brahma",
      price: "R$ 5,00",
      quantity: 10,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      product: expect.objectContaining({
        name: "Cerveja Brahma",
        price: "R$ 5,00",
        quantity: 10,
      }),
    });
  });
});
