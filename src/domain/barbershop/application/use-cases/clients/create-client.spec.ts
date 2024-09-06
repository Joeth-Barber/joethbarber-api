import { InMemoryClientsRepository } from "test/repositories/in-memory-clients-repository";
import { CreateClientUseCase } from "./create-client";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeClient } from "test/factories/make-client";
import { CPF } from "../../../enterprise/entities/value-objects/cpf";

let inMemoryClientsRepository: InMemoryClientsRepository;
let fakeHasher: FakeHasher;
let sut: CreateClientUseCase;

describe("Create Client", () => {
  beforeEach(() => {
    inMemoryClientsRepository = new InMemoryClientsRepository();
    fakeHasher = new FakeHasher();
    sut = new CreateClientUseCase(inMemoryClientsRepository, fakeHasher);
  });

  it("should be able to create a new client", async () => {
    const client = makeClient();

    const result = await sut.execute(client);

    expect(result.isRight()).toBe(true);
    expect(inMemoryClientsRepository.items).toHaveLength(1);
  });

  it("should hash client password upon creation", async () => {
    const client = makeClient({
      password: "123456",
    });

    const hashedPassword = await fakeHasher.hash("123456");

    const result = await sut.execute(client);

    expect(result.isRight()).toBe(true);
    expect(inMemoryClientsRepository.items).toHaveLength(1);
    expect(inMemoryClientsRepository.items[0].password).toEqual(hashedPassword);
  });

  // it("should hash client cpf upon creation", async () => {
  //   const client = makeClient({
  //     cpf: CPF.create("111.111.111-11"),
  //   });

  //   const hashedCpf = await fakeHasher.hash("11111111111");

  //   const result = await sut.execute(client);

  //   console.log(inMemoryClientsRepository.items[0].cpf.value);

  //   expect(result.isRight()).toBe(true);
  //   expect(inMemoryClientsRepository.items).toHaveLength(1);
  //   expect(inMemoryClientsRepository.items[0].cpf.value).toEqual(hashedCpf);
  // });

  it("should not be able to create a new user with existing phone", async () => {
    const client1 = makeClient({
      phone: "11933986562",
    });

    inMemoryClientsRepository.create(client1);
    expect(inMemoryClientsRepository.items).toHaveLength(1);

    const client2 = makeClient({
      phone: "11933986562",
    });

    const result = await sut.execute(client2);

    expect(result.isLeft()).toBe(true);
  });

  it("should not be able to create a new user with existing cpf", async () => {
    const client1 = makeClient({
      cpf: CPF.create("111.111.111-11"),
    });

    inMemoryClientsRepository.create(client1);
    expect(inMemoryClientsRepository.items).toHaveLength(1);

    const client2 = makeClient({
      cpf: CPF.create("111.111.111-11"),
    });

    const result = await sut.execute(client2);

    expect(result.isLeft()).toBe(true);
  });

  it("should not be able to create a new user with existing e-mail", async () => {
    const client1 = makeClient({
      email: "douglas@outlook.com",
    });

    inMemoryClientsRepository.create(client1);
    expect(inMemoryClientsRepository.items).toHaveLength(1);

    const client2 = makeClient({
      email: "douglas@outlook.com",
    });

    const result = await sut.execute(client2);

    expect(result.isLeft()).toBe(true);
  });
});
