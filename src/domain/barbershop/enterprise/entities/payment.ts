import { Entity } from "src/core/entities/entity";
import { UniqueEntityId } from "src/core/entities/unique-entity-id";

export interface PaymentProps {
  clientId: UniqueEntityId;
  status: "COMPLETED" | "PENDING" | "FAILED";
  paymentDate: Date;
  amount: string;
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

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(props: PaymentProps, id?: UniqueEntityId) {
    const payment = new Payment(
      {
        ...props,
      },
      id
    );

    return payment;
  }
}
