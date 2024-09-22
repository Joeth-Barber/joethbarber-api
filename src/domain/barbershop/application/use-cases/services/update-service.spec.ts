import { InMemoryServicesRepository } from "test/repositories/in-memory-services-repository";
import { makeService } from "test/factories/make-service";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { UpdateServiceUseCase } from "./update-service";
import { InMemoryBarbersRepository } from "test/repositories/in-memory-barbers-repository";
import { makeBarber } from "test/factories/make-barber";

let inMemoryServicesRepository: InMemoryServicesRepository;
let inMemoryBarbersRepository: InMemoryBarbersRepository;
let sut: UpdateServiceUseCase;

describe("Update Service", () => {
  beforeEach(() => {
    inMemoryServicesRepository = new InMemoryServicesRepository();
    inMemoryBarbersRepository = new InMemoryBarbersRepository();
    sut = new UpdateServiceUseCase(
      inMemoryServicesRepository,
      inMemoryBarbersRepository
    );
  });

  it("should be able to update a service", async () => {
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
      barberId: new UniqueEntityId("barber-01"),
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
