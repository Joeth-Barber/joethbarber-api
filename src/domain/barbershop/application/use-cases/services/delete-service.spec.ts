import { InMemoryServicesRepository } from "test/repositories/in-memory-services-repository";
import { DeleteServiceUseCase } from "./delete-service";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeService } from "test/factories/make-service";
import { InMemoryBarbersRepository } from "test/repositories/in-memory-barbers-repository";
import { makeBarber } from "test/factories/make-barber";

let inMemoryServicesRepository: InMemoryServicesRepository;
let inMemoryBarbersRepository: InMemoryBarbersRepository;
let sut: DeleteServiceUseCase;

describe("Delete Service", () => {
  beforeEach(() => {
    inMemoryServicesRepository = new InMemoryServicesRepository();
    inMemoryBarbersRepository = new InMemoryBarbersRepository();
    sut = new DeleteServiceUseCase(inMemoryServicesRepository);
  });

  it("should be able to delete a service", async () => {
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

    await inMemoryServicesRepository.create(
      makeService({}, new UniqueEntityId("service-01"))
    );
    expect(inMemoryServicesRepository.items).toHaveLength(1);

    const result = await sut.execute({
      serviceId: new UniqueEntityId("service-01"),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryServicesRepository.items).toHaveLength(0);
  });
});
