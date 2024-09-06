import { InMemoryBarbersRepository } from "test/repositories/in-memory-barbers-repository";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeBarber } from "test/factories/make-barber";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { UpdateBarberUseCase } from "./update-barber";

let inMemoryBarbersRepository: InMemoryBarbersRepository;
let fakeHasher: FakeHasher;
let sut: UpdateBarberUseCase;

describe("Update Barber", () => {
  beforeEach(() => {
    inMemoryBarbersRepository = new InMemoryBarbersRepository();
    fakeHasher = new FakeHasher();
    sut = new UpdateBarberUseCase(inMemoryBarbersRepository, fakeHasher);
  });

  it("should be able to update a barber", async () => {
    const barber = makeBarber(
      {
        fullName: "Douglas Welber",
      },
      new UniqueEntityId("barber-01")
    );

    inMemoryBarbersRepository.create(barber);
    expect(inMemoryBarbersRepository.items).toHaveLength(1);

    const result = await sut.execute({
      barberId: new UniqueEntityId("barber-01"),
      fullName: "Douglas Welber Santos",
      email: "douglas@outlook.com",
      password: "123456",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      barber: expect.objectContaining({
        fullName: "Douglas Welber Santos",
      }),
    });
  });
});
