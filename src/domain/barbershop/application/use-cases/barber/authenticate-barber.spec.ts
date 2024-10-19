import { FakeHasher } from "test/cryptography/fake-hasher";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { AuthenticateBarberUseCase } from "./authenticate-barber";
import { InMemoryBarbersRepository } from "test/repositories/in-memory-barbers-repository";
import { makeBarber } from "test/factories/make-barber";

let inMemoryBarbersRepository: InMemoryBarbersRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;

let sut: AuthenticateBarberUseCase;

describe("Authenticate Client", () => {
  beforeEach(() => {
    inMemoryBarbersRepository = new InMemoryBarbersRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateBarberUseCase(
      inMemoryBarbersRepository,
      fakeHasher,
      fakeEncrypter
    );
  });

  it("should be able to authenticate a barber", async () => {
    await inMemoryBarbersRepository.create(
      makeBarber({
        email: "johndoe@example.com",
        password: await fakeHasher.hash("123456"),
      })
    );

    const result = await sut.execute({
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });
});
