import { Injectable } from "@nestjs/common";
import { PaymentsRepository } from "../../repositories/payments-repository";
import { Either, left, right } from "@/core/either";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { NotAllowedError } from "@/core/errors/not-allowed";
import { ClientsRepository } from "../../repositories/clients-repository";

interface DeletePaymentUseCaseRequest {
  clientId: UniqueEntityId;
  paymentId: UniqueEntityId;
}

type DeletePaymentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>;

@Injectable()
export class DeletePaymentUseCase {
  constructor(
    private paymentsRepository: PaymentsRepository,
    private clientsRepository: ClientsRepository
  ) {}

  async execute({
    paymentId,
    clientId,
  }: DeletePaymentUseCaseRequest): Promise<DeletePaymentUseCaseResponse> {
    const payment = await this.paymentsRepository.findById(
      paymentId.toString()
    );

    if (!payment) {
      return left(new ResourceNotFoundError());
    }

    const client = await this.clientsRepository.findById(clientId.toString());

    if (!client) {
      return left(new ResourceNotFoundError());
    }

    if (payment.clientId.toString() !== clientId.toString()) {
      return left(new NotAllowedError());
    }

    await this.paymentsRepository.delete(payment);

    return right({});
  }
}
