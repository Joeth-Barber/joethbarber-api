import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { PaymentsRepository } from "../../repositories/payments-repository";
import { Payment } from "@/domain/barbershop/enterprise/entities/payment";
import { ClientsRepository } from "../../repositories/clients-repository";
import { NotAllowedError } from "@/core/errors/not-allowed";

export interface SetPaymentCompletedUseCaseRequest {
  clientId: UniqueEntityId;
  paymentId: UniqueEntityId;
}

type SetPaymentCompletedUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { payment: Payment }
>;

@Injectable()
export class SetPaymentCompletedUseCase {
  constructor(
    private paymentsRepository: PaymentsRepository,
    private clientsRepository: ClientsRepository
  ) {}

  async execute({
    clientId,
    paymentId,
  }: SetPaymentCompletedUseCaseRequest): Promise<SetPaymentCompletedUseCaseResponse> {
    const client = await this.clientsRepository.findById(clientId.toString());

    if (!client) {
      return left(new ResourceNotFoundError());
    }

    const payment = await this.paymentsRepository.findById(
      paymentId.toString()
    );

    if (!payment) {
      return left(new ResourceNotFoundError());
    }

    if (payment.clientId.toString() !== clientId.toString()) {
      return left(new NotAllowedError());
    }

    payment.status = "COMPLETED"; // COMPLETED
    payment.paymentDate = new Date();

    await this.paymentsRepository.save(payment);

    return right({
      payment,
    });
  }
}
