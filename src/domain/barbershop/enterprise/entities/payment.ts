import { Entity } from "src/core/entities/entity";
import { UniqueEntityId } from "src/core/entities/unique-entity-id";
import { Optional } from "src/core/types/optional";

export interface PaymentProps {
  clientId: UniqueEntityId;
  status: "COMPLETED" | "PENDING" | "FAILED";
  paymentDate: Date;
  amount: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Payment extends Entity<PaymentProps> {
  get clientId() {
    return this.props.clientId;
  }

  get status() {
    return this.props.status;
  }

  set status(status: "COMPLETED" | "PENDING" | "FAILED") {
    this.props.status = status;
    this.touch();
  }

  get paymentDate() {
    return this.props.paymentDate;
  }

  set paymentDate(paymentDate: Date) {
    this.props.paymentDate = paymentDate;
    this.touch();
  }

  get amount() {
    return this.props.amount;
  }

  set amount(amount: string) {
    this.props.amount = amount;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<PaymentProps, "createdAt">,
    id?: UniqueEntityId
  ) {
    const payment = new Payment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );

    return payment;
  }
}
