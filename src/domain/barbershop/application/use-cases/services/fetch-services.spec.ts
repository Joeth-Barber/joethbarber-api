import { InMemoryServicesRepository } from "test/repositories/in-memory-services-repository";
import { makeService } from "test/factories/make-service";
import { FetchServicesUseCase } from "./fetch-services";

let inMemoryServicesRepository: InMemoryServicesRepository;
let sut: FetchServicesUseCase;

describe("Fetch Services", () => {
  beforeEach(() => {
    inMemoryServicesRepository = new InMemoryServicesRepository();
    sut = new FetchServicesUseCase(inMemoryServicesRepository);
  });

  it("should be able to fetch a list of services", async () => {
    await inMemoryServicesRepository.create(
      makeService({
        name: "Corte de cabelo",
      })
    );
    await inMemoryServicesRepository.create(
      makeService({
        name: "Sobrancelha",
      })
    );
    await inMemoryServicesRepository.create(
      makeService({
        name: "Barba",
      })
    );
    expect(inMemoryServicesRepository.items).toHaveLength(3);

    const result = await sut.execute({
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.services).toEqual([
      expect.objectContaining({ name: "Corte de cabelo" }),
      expect.objectContaining({ name: "Sobrancelha" }),
      expect.objectContaining({ name: "Barba" }),
    ]);
  });

  it("should be able to fetch paginated list of services", async () => {
    for (let i = 1; i <= 12; i++) {
      await inMemoryServicesRepository.create(makeService());
    }

    const result = await sut.execute({
      page: 2,
    });

    expect(result.value?.services).toHaveLength(2);
  });
});
