import { Injectable } from "@nestjs/common";
import { PaymentsRepository } from "../../repositories/payments-repository";
import { Either, left, right } from "@/core/either";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface DeletePaymentUseCaseRequest {
  paymentId: UniqueEntityId;
}

type DeletePaymentUseCaseResponse = Either<ResourceNotFoundError, {}>;

@Injectable()
export class DeletePaymentUseCase {
  constructor(private paymentsRepository: PaymentsRepository) {}

  async execute({
    paymentId,
  }: DeletePaymentUseCaseRequest): Promise<DeletePaymentUseCaseResponse> {
    const payment = await this.paymentsRepository.findById(
      paymentId.toString()
    );

    if (!payment) {
      return left(new ResourceNotFoundError());
    }

    await this.paymentsRepository.delete(payment);

    return right({});
  }
}
