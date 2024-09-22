import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { makeProduct } from "test/factories/make-product";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { UpdateProductUseCase } from "./update-product";
import { InMemoryBarbersRepository } from "test/repositories/in-memory-barbers-repository";
import { makeBarber } from "test/factories/make-barber";

let inMemoryProductsRepository: InMemoryProductsRepository;
let inMemoryBarbersRepository: InMemoryBarbersRepository;
let sut: UpdateProductUseCase;

describe("Update Product", () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    inMemoryBarbersRepository = new InMemoryBarbersRepository();
    sut = new UpdateProductUseCase(
      inMemoryProductsRepository,
      inMemoryBarbersRepository
    );
  });

  it("should be able to update a product", async () => {
    await inMemoryBarbersRepository.create(
      makeBarber(
        {
          fullName: "Joeth Barber",
          role: "ADMIN",
        },
        new UniqueEntityId("barber-01")
      )
    );
    expect(inMemoryBarbersRepository.items).toHaveLength(1);

    await inMemoryProductsRepository.create(
      makeProduct(
        {
          name: "Cerveja Skol",
          price: 5.0,
          quantity: 10,
        },
        new UniqueEntityId("product-01")
      )
    );
    expect(inMemoryProductsRepository.items).toHaveLength(1);

    const result = await sut.execute({
      productId: new UniqueEntityId("product-01"),
      barberId: new UniqueEntityId("barber-01"),
      name: "Cerveja Brahma",
      price: 5.0,
      quantity: 10,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      product: expect.objectContaining({
        name: "Cerveja Brahma",
        price: 5.0,
        quantity: 10,
      }),
    });
  });
});
