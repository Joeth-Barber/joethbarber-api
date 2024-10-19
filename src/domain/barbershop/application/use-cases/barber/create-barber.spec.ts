import { makeBarber } from "test/factories/make-barber";
import { CreateBarberUseCase } from "./create-barber";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { InMemoryBarbersRepository } from "test/repositories/in-memory-barbers-repository";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";

let inMemoryBarbersRepository: InMemoryBarbersRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: CreateBarberUseCase;

describe("Create Barber", () => {
  beforeEach(() => {
    inMemoryBarbersRepository = new InMemoryBarbersRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new CreateBarberUseCase(
      inMemoryBarbersRepository,
      fakeHasher,
      fakeEncrypter
    );
  });

  it("should be able to create a new barber", async () => {
    const barber = makeBarber();

    const result = await sut.execute(barber);

    expect(result.isRight()).toBe(true);
    expect(inMemoryBarbersRepository.items).toHaveLength(1);
  });

  it("should hash barber password upon creation", async () => {
    const barber = makeBarber({
      password: "123456",
    });

    const hashedPassword = await fakeHasher.hash("123456");

    const result = await sut.execute(barber);

    expect(result.isRight()).toBe(true);
    expect(inMemoryBarbersRepository.items).toHaveLength(1);
    expect(inMemoryBarbersRepository.items[0].password).toEqual(hashedPassword);
  });

  it("should not be able to create a new user with existing e-mail", async () => {
    const barber1 = makeBarber({
      email: "joeth@outlook.com",
    });

    inMemoryBarbersRepository.create(barber1);
    expect(inMemoryBarbersRepository.items).toHaveLength(1);

    const barber2 = makeBarber({
      email: "joeth@outlook.com",
    });

    const result = await sut.execute(barber2);

    expect(result.isLeft()).toBe(true);
  });
});
