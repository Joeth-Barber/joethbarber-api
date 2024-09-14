import { InMemoryPaymentsRepository } from "test/repositories/in-memory-payments-repository";
import { makePayment } from "test/factories/make-payment";
import { DeletePaymentUseCase } from "./delete-payment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryClientsRepository } from "test/repositories/in-memory-clients-repository";
import { makeClient } from "test/factories/make-client";

let inMemoryPaymentsRepository: InMemoryPaymentsRepository;
let inMemoryClientsRepository: InMemoryClientsRepository;
let sut: DeletePaymentUseCase;

describe("Delete Payment", () => {
  beforeEach(() => {
    inMemoryPaymentsRepository = new InMemoryPaymentsRepository();
    inMemoryClientsRepository = new InMemoryClientsRepository();
    sut = new DeletePaymentUseCase(
      inMemoryPaymentsRepository,
      inMemoryClientsRepository
    );
  });

  it("should be able to delete a payment", async () => {
    await inMemoryClientsRepository.create(
      makeClient({}, new UniqueEntityId("client-01"))
    );
    expect(inMemoryClientsRepository.items).toHaveLength(1);

    await inMemoryPaymentsRepository.create(
      makePayment(
        {
          clientId: new UniqueEntityId("client-01"),
          amount: 50,
        },
        new UniqueEntityId("payment-01")
      )
    );
    expect(inMemoryPaymentsRepository.items).toHaveLength(1);
    expect(inMemoryPaymentsRepository.items[0].amount).toBe(50);

    const result = await sut.execute({
      paymentId: new UniqueEntityId("payment-01"),
      clientId: new UniqueEntityId("client-01"),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryPaymentsRepository.items).toHaveLength(0);
  });
});
