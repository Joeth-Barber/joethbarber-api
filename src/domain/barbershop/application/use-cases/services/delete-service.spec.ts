import { InMemoryServicesRepository } from "test/repositories/in-memory-services-repository";
import { DeleteServiceUseCase } from "./delete-service";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeService } from "test/factories/make-service";

let inMemoryServicesRepository: InMemoryServicesRepository;
let sut: DeleteServiceUseCase;

describe("Delete Service", () => {
  beforeEach(() => {
    inMemoryServicesRepository = new InMemoryServicesRepository();
    sut = new DeleteServiceUseCase(inMemoryServicesRepository);
  });

  it("should be able to delete a service", async () => {
    const service = makeService({}, new UniqueEntityId("service-01"));
    inMemoryServicesRepository.create(service);
    expect(inMemoryServicesRepository.items).toHaveLength(1);

    const result = await sut.execute({
      serviceId: new UniqueEntityId("service-01"),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryServicesRepository.items).toHaveLength(0);
  });
});
