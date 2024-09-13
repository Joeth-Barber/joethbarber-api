import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { SetPaymentCompletedUseCase } from "./set-payment-completed";
import { InMemoryPaymentsRepository } from "test/repositories/in-memory-payments-repository";
import { InMemoryClientsRepository } from "test/repositories/in-memory-clients-repository";
import { makeClient } from "test/factories/make-client";
import { makePayment } from "test/factories/make-payment";

let inMemoryPaymentsRepository: InMemoryPaymentsRepository;
let inMemoryClientsRepository: InMemoryClientsRepository;
let sut: SetPaymentCompletedUseCase;

describe("Set Payment Completed", () => {
  beforeEach(() => {
    inMemoryPaymentsRepository = new InMemoryPaymentsRepository();
    inMemoryClientsRepository = new InMemoryClientsRepository();
    sut = new SetPaymentCompletedUseCase(
      inMemoryPaymentsRepository,
      inMemoryClientsRepository
    );
  });

  it("should be able to update a payment", async () => {
    await inMemoryClientsRepository.create(
      makeClient({}, new UniqueEntityId("client-01"))
    );

    await inMemoryPaymentsRepository.create(
      makePayment(
        {
          clientId: new UniqueEntityId("client-01"),
          amount: 50,
          status: "PENDING",
        },
        new UniqueEntityId("payment-01")
      )
    );

    const result = await sut.execute({
      clientId: new UniqueEntityId("client-01"),
      paymentId: new UniqueEntityId("payment-01"),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryPaymentsRepository.items[0].status).toBe("COMPLETED");
    expect(inMemoryPaymentsRepository.items[0].paymentDate).toEqual(
      expect.any(Date)
    );
  });
});
