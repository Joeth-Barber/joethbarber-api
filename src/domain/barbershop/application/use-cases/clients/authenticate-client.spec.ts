import { InMemoryClientsRepository } from "test/repositories/in-memory-clients-repository";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { AuthenticateClientUseCase } from "./authenticate-client";
import { makeClient } from "test/factories/make-client";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";

let inMemoryClientsRepository: InMemoryClientsRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;

let sut: AuthenticateClientUseCase;

describe("Authenticate Client", () => {
  beforeEach(() => {
    inMemoryClientsRepository = new InMemoryClientsRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateClientUseCase(
      inMemoryClientsRepository,
      fakeHasher,
      fakeEncrypter
    );
  });

  it("should be able to authenticate a client", async () => {
    await inMemoryClientsRepository.create(
      makeClient({
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
