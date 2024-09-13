import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ClientsRepository } from "../../repositories/clients-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { PaymentsRepository } from "../../repositories/payments-repository";
import { Payment } from "@/domain/barbershop/enterprise/entities/payment";

export interface FetchPaymentsByClientIdUseCaseRequest {
  clientId: UniqueEntityId;
  page: number;
}

type FetchPaymentsByClientIdUseCaseResponse = Either<
  ResourceNotFoundError,
  { payments: Payment[] }
>;

@Injectable()
export class FetchPaymentsByClientIdUseCase {
  constructor(
    private paymentsRepository: PaymentsRepository,
    private clientsRepository: ClientsRepository
  ) {}

  async execute({
    clientId,
    page,
  }: FetchPaymentsByClientIdUseCaseRequest): Promise<FetchPaymentsByClientIdUseCaseResponse> {
    const client = await this.clientsRepository.findById(clientId.toString());

    if (!client) {
      return left(new ResourceNotFoundError());
    }

    const payments = await this.paymentsRepository.fetchByClientId(
      { page },
      clientId.toString()
    );

    return right({
      payments,
    });
  }
}
