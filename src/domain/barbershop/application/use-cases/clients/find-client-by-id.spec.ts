import { InMemoryClientsRepository } from "test/repositories/in-memory-clients-repository";
import { makeClient } from "test/factories/make-client";
import { FindClientByIdUseCase } from "./find-client-by-id";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

let inMemoryClientsRepository: InMemoryClientsRepository;
let sut: FindClientByIdUseCase;

describe("Find Clients By Id", () => {
  beforeEach(() => {
    inMemoryClientsRepository = new InMemoryClientsRepository();
    sut = new FindClientByIdUseCase(inMemoryClientsRepository);
  });

  it("should be able to find a client by id", async () => {
    await inMemoryClientsRepository.create(
      makeClient(
        {
          fullName: "Douglas Welber Santos",
        },
        new UniqueEntityId("client-01")
      )
    );

    await inMemoryClientsRepository.create(
      makeClient(
        {
          fullName: "Samuel Nascimento",
        },
        new UniqueEntityId("client-02")
      )
    );

    expect(inMemoryClientsRepository.items).toHaveLength(2);

    const result = await sut.execute({
      clientId: new UniqueEntityId("client-02"),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      client: expect.objectContaining({ fullName: "Samuel Nascimento" }),
    });
  });
});
