import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { CreateProductUseCase } from "./create-product";
import { makeProduct } from "test/factories/make-product";

let inMemoryProductsRepository: InMemoryProductsRepository;
let sut: CreateProductUseCase;

describe("Create Product", () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    sut = new CreateProductUseCase(inMemoryProductsRepository);
  });

  it("should be able to create a new product", async () => {
    const product = makeProduct();

    const result = await sut.execute(product);

    expect(result.isRight()).toBe(true);
    expect(inMemoryProductsRepository.items).toHaveLength(1);
  });
});
