import { InMemoryClientsRepository } from "test/repositories/in-memory-clients-repository";
import { makeClient } from "test/factories/make-client";
import { FetchClientsUseCase } from "./fetch-clients";

let inMemoryClientsRepository: InMemoryClientsRepository;
let sut: FetchClientsUseCase;

describe("Fetch Clients", () => {
  beforeEach(() => {
    inMemoryClientsRepository = new InMemoryClientsRepository();
    sut = new FetchClientsUseCase(inMemoryClientsRepository);
  });

  it("should be able to fetch a list of clients", async () => {
    await inMemoryClientsRepository.create(
      makeClient({
        fullName: "Douglas Welber",
      })
    );
    await inMemoryClientsRepository.create(
      makeClient({
        fullName: "Samuel Nascimento",
      })
    );
    await inMemoryClientsRepository.create(
      makeClient({
        fullName: "Tales Macedo",
      })
    );
    expect(inMemoryClientsRepository.items).toHaveLength(3);

    const result = await sut.execute({
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.clients).toEqual([
      expect.objectContaining({ fullName: "Douglas Welber" }),
      expect.objectContaining({ fullName: "Samuel Nascimento" }),
      expect.objectContaining({ fullName: "Tales Macedo" }),
    ]);
  });

  it("should be able to fetch paginated list of clients", async () => {
    for (let i = 1; i <= 12; i++) {
      await inMemoryClientsRepository.create(makeClient());
    }

    const result = await sut.execute({
      page: 2,
    });

    expect(result.value?.clients).toHaveLength(2);
  });
});
