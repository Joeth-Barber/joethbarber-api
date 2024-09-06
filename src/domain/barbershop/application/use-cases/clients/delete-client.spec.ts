import { InMemoryClientsRepository } from "test/repositories/in-memory-clients-repository";
import { makeClient } from "test/factories/make-client";
import { DeleteClientUseCase } from "./delete-client";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

let inMemoryClientsRepository: InMemoryClientsRepository;
let sut: DeleteClientUseCase;

describe("Delete Client", () => {
  beforeEach(() => {
    inMemoryClientsRepository = new InMemoryClientsRepository();
    sut = new DeleteClientUseCase(inMemoryClientsRepository);
  });

  it("should be able to delete a client", async () => {
    const client = makeClient({}, new UniqueEntityId("client-01"));
    inMemoryClientsRepository.create(client);
    expect(inMemoryClientsRepository.items).toHaveLength(1);

    const result = await sut.execute({
      clientId: new UniqueEntityId("client-01"),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryClientsRepository.items).toHaveLength(0);
  });
});
