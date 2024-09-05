import { Entity } from "src/core/entities/entity";
import { UniqueEntityId } from "src/core/entities/unique-entity-id";
import { Payment } from "./payment";
import { Booking } from "./booking";
import { Address } from "./address";
import { Optional } from "src/core/types/optional";
import { CPF } from "./value-objects/cpf";

export interface ClientProps {
  fullName: string;
  nickName: string;
  phone: string;
  cpf: CPF;
  email: string;
  password: string;
  billingDay: number; // dia do mês. Ex: 10
  payments: Payment[];
  bookings: Booking[];
  address: Address | null;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Client extends Entity<ClientProps> {
  get fullName() {
    return this.props.fullName;
  }

  set fullName(fullName: string) {
    this.props.fullName = fullName;
    this.touch();
  }

  get nickName() {
    return this.props.nickName;
  }

  set nickName(nickName: string) {
    this.props.nickName = nickName;
    this.touch();
  }

  get phone() {
    return this.props.phone;
  }

  set phone(phone: string) {
    this.props.phone = phone;
    this.touch();
  }

  get cpf() {
    return this.props.cpf;
  }

  get email() {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
    this.touch();
  }

  get password() {
    return this.props.password;
  }

  set password(password: string) {
    this.props.password = password;
    this.touch();
  }

  get billingDay() {
    return this.props.billingDay;
  }

  set billingDay(billingDay: number) {
    this.props.billingDay = billingDay;
    this.touch();
  }

  get payments() {
    return this.props.payments;
  }

  set payments(payments: Payment[]) {
    this.props.payments = payments;
    this.touch();
  }

  get bookings() {
    return this.props.bookings;
  }

  set bookings(bookings: Booking[]) {
    this.props.bookings = bookings;
    this.touch();
  }

  get address() {
    return this.props.address;
  }

  set address(address: Address | null) {
    this.props.address = address;
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
    props: Optional<
      ClientProps,
      "billingDay" | "payments" | "bookings" | "address" | "createdAt"
    >,
    id?: UniqueEntityId
  ) {
    const client = new Client(
      {
        ...props,
        billingDay: props.billingDay ?? 0,
        payments: props.payments ?? [],
        bookings: props.bookings ?? [],
        address: props.address ?? null,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );

    return client;
  }
}
