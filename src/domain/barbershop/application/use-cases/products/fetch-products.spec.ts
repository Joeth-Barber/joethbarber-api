import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { makeProduct } from "test/factories/make-product";
import { FetchProductsUseCase } from "./fetch-products";

let inMemoryProductsRepository: InMemoryProductsRepository;
let sut: FetchProductsUseCase;

describe("Fetch Products", () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    sut = new FetchProductsUseCase(inMemoryProductsRepository);
  });

  it("should be able to fetch a list of products", async () => {
    await inMemoryProductsRepository.create(
      makeProduct({
        name: "Pomada modeladora",
      })
    );
    await inMemoryProductsRepository.create(
      makeProduct({
        name: "Coca-cola 400ml",
      })
    );
    await inMemoryProductsRepository.create(
      makeProduct({
        name: "Fanta laranja 400ml",
      })
    );
    expect(inMemoryProductsRepository.items).toHaveLength(3);

    const result = await sut.execute({
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.products).toEqual([
      expect.objectContaining({ name: "Pomada modeladora" }),
      expect.objectContaining({ name: "Coca-cola 400ml" }),
      expect.objectContaining({ name: "Fanta laranja 400ml" }),
    ]);
  });

  it("should be able to fetch paginated list of products", async () => {
    for (let i = 1; i <= 12; i++) {
      await inMemoryProductsRepository.create(makeProduct());
    }

    const result = await sut.execute({
      page: 2,
    });

    expect(result.value?.products).toHaveLength(2);
  });
});
