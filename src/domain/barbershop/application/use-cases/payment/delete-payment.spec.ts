import { InMemoryPaymentsRepository } from "test/repositories/in-memory-payments-repository";
import { makePayment } from "test/factories/make-payment";
import { DeletePaymentUseCase } from "./delete-payment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

let inMemoryPaymentsRepository: InMemoryPaymentsRepository;
let sut: DeletePaymentUseCase;

describe("Delete Payment", () => {
  beforeEach(() => {
    inMemoryPaymentsRepository = new InMemoryPaymentsRepository();
    sut = new DeletePaymentUseCase(inMemoryPaymentsRepository);
  });

  it("should be able to delete a payment", async () => {
    const payment = makePayment({}, new UniqueEntityId("payment-01"));
    inMemoryPaymentsRepository.create(payment);
    expect(inMemoryPaymentsRepository.items).toHaveLength(1);

    const result = await sut.execute({
      paymentId: new UniqueEntityId("payment-01"),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryPaymentsRepository.items).toHaveLength(0);
  });
});
