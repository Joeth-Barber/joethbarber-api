import { CreateClientAddressUseCase } from "./create-client-address";
import { InMemoryClientsRepository } from "test/repositories/in-memory-clients-repository";
import { InMemoryClientsAddressesRepository } from "test/repositories/in-memory-clients-addresses-repository";
import { makeClient } from "test/factories/make-client";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeClientsAddresses } from "test/factories/make-clients-addresses";

let inMemoryClientsRepository: InMemoryClientsRepository;
let inMemoryClientsAddressesRepository: InMemoryClientsAddressesRepository;
let sut: CreateClientAddressUseCase;

describe("Create Clients Addresses", () => {
  beforeEach(() => {
    inMemoryClientsRepository = new InMemoryClientsRepository();
    inMemoryClientsAddressesRepository =
      new InMemoryClientsAddressesRepository();
    sut = new CreateClientAddressUseCase(
      inMemoryClientsRepository,
      inMemoryClientsAddressesRepository
    );
  });

  it("should be able to create a client address", async () => {
    const client = makeClient({}, new UniqueEntityId("client-01"));
    inMemoryClientsRepository.create(client);
    expect(inMemoryClientsRepository.items).toHaveLength(1);

    const address = makeClientsAddresses({
      clientId: new UniqueEntityId("client-01"),
    });

    const result = await sut.execute(address);
    expect(inMemoryClientsAddressesRepository.items).toHaveLength(1);

    expect(result.isRight()).toBe(true);
    expect(
      inMemoryClientsAddressesRepository.items[0].clientId.toString()
    ).toEqual("client-01");
  });

  it("should not be able to create a non existing client address", async () => {
    const client = makeClient({}, new UniqueEntityId("client-01"));
    inMemoryClientsRepository.create(client);
    expect(inMemoryClientsRepository.items).toHaveLength(1);

    const address = makeClientsAddresses({
      clientId: new UniqueEntityId("client-02"),
    });

    const result = await sut.execute(address);

    expect(result.isLeft()).toBe(true);
    expect(inMemoryClientsAddressesRepository.items).toHaveLength(0);
  });
});
