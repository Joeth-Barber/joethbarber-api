import { InMemoryClientsRepository } from "test/repositories/in-memory-clients-repository";
import { makeClient } from "test/factories/make-client";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ToggleClientRole } from "./toggle-client-role";
import { CreateClientUseCase } from "./create-client";

let inMemoryClientsRepository: InMemoryClientsRepository;
let createClient: CreateClientUseCase;
let sut: ToggleClientRole;

describe("Toggle Client Role", () => {
  beforeEach(() => {
    inMemoryClientsRepository = new InMemoryClientsRepository();
    sut = new ToggleClientRole(inMemoryClientsRepository);
  });

  it("should be able to toggle client role to mensalist", async () => {
    await inMemoryClientsRepository.create(
      makeClient({}, new UniqueEntityId("client-01"))
    );
    expect(inMemoryClientsRepository.items).toHaveLength(1);

    const result = await sut.execute({
      clientId: new UniqueEntityId("client-01"),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryClientsRepository.items[0].role).toBe("MENSALIST");
  });

  it("should be able to toggle client role to client", async () => {
    await inMemoryClientsRepository.create(
      makeClient(
        {
          role: "MENSALIST",
        },
        new UniqueEntityId("client-01")
      )
    );
    expect(inMemoryClientsRepository.items).toHaveLength(1);

    const result = await sut.execute({
      clientId: new UniqueEntityId("client-01"),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryClientsRepository.items[0].role).toBe("CLIENT");
  });
});
