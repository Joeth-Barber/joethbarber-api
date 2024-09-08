import { InMemoryServicesRepository } from "test/repositories/in-memory-services-repository";
import { makeService } from "test/factories/make-service";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { UpdateServiceUseCase } from "./update-service";

let inMemoryServicesRepository: InMemoryServicesRepository;
let sut: UpdateServiceUseCase;

describe("Update Service", () => {
  beforeEach(() => {
    inMemoryServicesRepository = new InMemoryServicesRepository();
    sut = new UpdateServiceUseCase(inMemoryServicesRepository);
  });

  it("should be able to update a service", async () => {
    await inMemoryServicesRepository.create(
      makeService(
        {
          name: "Corte de cabelo",
          price: 35.0,
        },
        new UniqueEntityId("service-01")
      )
    );
    expect(inMemoryServicesRepository.items).toHaveLength(1);

    const result = await sut.execute({
      serviceId: new UniqueEntityId("service-01"),
      name: "Corte de cabelo",
      price: 25.0,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      service: expect.objectContaining({
        name: "Corte de cabelo",
        price: 25.0,
      }),
    });
  });
});
