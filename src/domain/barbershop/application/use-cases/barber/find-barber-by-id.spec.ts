import { InMemoryBarbersRepository } from "test/repositories/in-memory-barbers-repository";
import { makeBarber } from "test/factories/make-barber";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { FindBarberByIdUseCase } from "./find-barber-by-id";

let inMemoryBarbersRepository: InMemoryBarbersRepository;
let sut: FindBarberByIdUseCase;

describe("Find Barbers By Id", () => {
  beforeEach(() => {
    inMemoryBarbersRepository = new InMemoryBarbersRepository();
    sut = new FindBarberByIdUseCase(inMemoryBarbersRepository);
  });

  it("should be able to find a barber by id", async () => {
    await inMemoryBarbersRepository.create(
      makeBarber(
        {
          fullName: "Douglas Welber Santos",
        },
        new UniqueEntityId("barber-01")
      )
    );

    await inMemoryBarbersRepository.create(
      makeBarber(
        {
          fullName: "Samuel Nascimento",
        },
        new UniqueEntityId("barber-02")
      )
    );

    expect(inMemoryBarbersRepository.items).toHaveLength(2);

    const result = await sut.execute({
      barberId: new UniqueEntityId("barber-02"),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      barber: expect.objectContaining({ fullName: "Samuel Nascimento" }),
    });
  });
});
