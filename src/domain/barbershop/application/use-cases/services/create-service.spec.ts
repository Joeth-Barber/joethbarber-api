import { InMemoryServicesRepository } from "test/repositories/in-memory-services-repository";
import { CreateServiceUseCase } from "./create-service";

let inMemoryServicesRepository: InMemoryServicesRepository;
let sut: CreateServiceUseCase;

describe("Create Service", () => {
  beforeEach(() => {
    inMemoryServicesRepository = new InMemoryServicesRepository();
    sut = new CreateServiceUseCase(inMemoryServicesRepository);
  });

  it("should be able to create a new service", async () => {
    const service = {
      name: "Corte de cabelo",
      price: "R$ 30,00",
    };

    const result = await sut.execute(service);

    expect(result.isRight()).toBe(true);
    expect(inMemoryServicesRepository.items).toHaveLength(1);
  });
});
