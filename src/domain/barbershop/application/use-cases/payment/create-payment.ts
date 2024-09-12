import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ClientsRepository } from "../../repositories/clients-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { PaymentsRepository } from "../../repositories/payments-repository";
import { Booking } from "@/domain/barbershop/enterprise/entities/booking";
import { Payment } from "@/domain/barbershop/enterprise/entities/payment";
import { Product } from "@/domain/barbershop/enterprise/entities/product";

export interface CreatePaymentUseCaseRequest {
  clientId: UniqueEntityId;
  status: "COMPLETED" | "PENDING";
  bookings: Booking[];
  products: Product[];
  paymentDate: Date | null;
}

type CreatePaymentUseCaseResponse = Either<
  ResourceNotFoundError,
  { payment: Payment }
>;

@Injectable()
export class CreatePaymentUseCase {
  constructor(
    private paymentsRepository: PaymentsRepository,
    private clientsRepository: ClientsRepository
  ) {}

  async execute({
    clientId,
    status,
    paymentDate,
    bookings,
    products,
  }: CreatePaymentUseCaseRequest): Promise<CreatePaymentUseCaseResponse> {
    const client = await this.clientsRepository.findById(clientId.toString());

    if (!client) {
      return left(new ResourceNotFoundError());
    }

    if (!paymentDate || paymentDate === null) {
      status = "PENDING";
    }

    if (paymentDate && (!status || status === "PENDING")) {
      status = "COMPLETED";
    }

    let totalAmount = 0;

    if (bookings.length > 0) {
      totalAmount += bookings.reduce(
        (total, booking) => total + booking.totalPrice,
        0
      );
    }

    if (products.length > 0) {
      totalAmount += products.reduce(
        (total, product) => total + product.price,
        0
      );
    }

    const payment = Payment.create({
      clientId,
      status,
      amount: totalAmount,
      paymentDate,
      bookings,
      products,
    });

    await this.paymentsRepository.create(payment);

    return right({
      payment,
    });
  }
}
