import { InMemoryServicesRepository } from "test/repositories/in-memory-services-repository";
import { makeService } from "test/factories/make-service";
import { FindServiceByIdUseCase } from "./find-service-by-id";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

let inMemoryServicesRepository: InMemoryServicesRepository;
let sut: FindServiceByIdUseCase;

describe("Find Services By Id", () => {
  beforeEach(() => {
    inMemoryServicesRepository = new InMemoryServicesRepository();
    sut = new FindServiceByIdUseCase(inMemoryServicesRepository);
  });

  it("should be able to find a service by id", async () => {
    await inMemoryServicesRepository.create(
      makeService(
        {
          name: "Corte de cabelo",
        },
        new UniqueEntityId("service-01")
      )
    );

    await inMemoryServicesRepository.create(
      makeService(
        {
          name: "Sobrancelha",
        },
        new UniqueEntityId("service-02")
      )
    );

    expect(inMemoryServicesRepository.items).toHaveLength(2);

    const result = await sut.execute({
      serviceId: new UniqueEntityId("service-02"),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      service: expect.objectContaining({ name: "Sobrancelha" }),
    });
  });
});
