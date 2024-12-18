import { InMemoryClientsRepository } from "test/repositories/in-memory-clients-repository";
import { makeClient } from "test/factories/make-client";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { UpdateClientUseCase } from "./update-client";

let inMemoryClientsRepository: InMemoryClientsRepository;
let sut: UpdateClientUseCase;

describe("Update Client", () => {
  beforeEach(() => {
    inMemoryClientsRepository = new InMemoryClientsRepository();
    sut = new UpdateClientUseCase(inMemoryClientsRepository);
  });

  it("should be able to update a client", async () => {
    const client = makeClient(
      {
        fullName: "Douglas Welber",
        nickName: "dodo",
      },
      new UniqueEntityId("client-01")
    );

    inMemoryClientsRepository.create(client);
    expect(inMemoryClientsRepository.items).toHaveLength(1);

    const result = await sut.execute({
      clientId: new UniqueEntityId("client-01"),
      fullName: "Douglas Welber Santos",
      nickName: "dododo",
      phone: "11933986562",
      email: "douglas@outlook.com",
      billingDay: 10,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      client: expect.objectContaining({
        fullName: "Douglas Welber Santos",
        nickName: "dododo",
      }),
    });
  });
});
