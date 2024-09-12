import { Entity } from "src/core/entities/entity";
import { UniqueEntityId } from "src/core/entities/unique-entity-id";
import { Booking } from "./booking";
import { Product } from "./product";
import { Optional } from "@/core/types/optional";

export interface PaymentProps {
  clientId: UniqueEntityId;
  status: "COMPLETED" | "PENDING";
  bookings: Booking[];
  products: Product[];
  amount: number;
  paymentDate: Date | null;
  updatedAt?: Date | null;
}

export class Payment extends Entity<PaymentProps> {
  get clientId() {
    return this.props.clientId;
  }

  get status() {
    return this.props.status;
  }

  set status(status: "COMPLETED" | "PENDING") {
    this.props.status = status;
    this.touch();
  }

  get paymentDate() {
    return this.props.paymentDate;
  }

  set paymentDate(paymentDate: Date | null) {
    this.props.paymentDate = paymentDate;
    this.touch();
  }

  get bookings() {
    return this.props.bookings;
  }

  set bookings(bookings: Booking[]) {
    this.props.bookings = bookings;
    this.touch();
  }

  get products() {
    return this.props.products;
  }

  set products(products: Product[]) {
    this.props.products = products;
    this.touch();
  }

  get amount() {
    return this.props.amount;
  }

  set amount(amount: number) {
    this.props.amount = amount;
    this.touch();
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<
      PaymentProps,
      "bookings" | "products" | "status" | "paymentDate"
    >,
    id?: UniqueEntityId
  ) {
    const payment = new Payment(
      {
        ...props,
        bookings: props.bookings ?? [],
        products: props.products ?? [],
        status: props.status ?? "PENDING",
        paymentDate: props.paymentDate ?? null,
      },
      id
    );

    return payment;
  }
}
