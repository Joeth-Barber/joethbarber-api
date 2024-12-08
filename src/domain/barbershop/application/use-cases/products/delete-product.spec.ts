import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { DeleteProductUseCase } from "./delete-product";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeProduct } from "test/factories/make-product";
import { InMemoryBarbersRepository } from "test/repositories/in-memory-barbers-repository";
import { makeBarber } from "test/factories/make-barber";

let inMemoryProductsRepository: InMemoryProductsRepository;
let inMemoryBarbersRepository: InMemoryBarbersRepository;
let sut: DeleteProductUseCase;

describe("Delete Product", () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    inMemoryBarbersRepository = new InMemoryBarbersRepository();
    sut = new DeleteProductUseCase(inMemoryProductsRepository);
  });

  it("should be able to delete a product", async () => {
    await inMemoryBarbersRepository.create(
      makeBarber({}, new UniqueEntityId("barber-01"))
    );

    expect(inMemoryBarbersRepository.items).toHaveLength(1);

    await inMemoryProductsRepository.create(
      makeProduct({}, new UniqueEntityId("product-01"))
    );
    expect(inMemoryProductsRepository.items).toHaveLength(1);

    const result = await sut.execute({
      productId: new UniqueEntityId("product-01"),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryProductsRepository.items).toHaveLength(0);
  });
});
