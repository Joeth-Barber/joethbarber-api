import { Entity } from "src/core/entities/entity";
import { UniqueEntityId } from "src/core/entities/unique-entity-id";
import { Optional } from "src/core/types/optional";
import { Product } from "./product";
import { Service } from "./service";

export interface BookingProps {
  clientId: UniqueEntityId;
  date: Date;
  totalPrice: string;
  description: string;
  services: Service[];
  products: Product[];
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Booking extends Entity<BookingProps> {
  get clientId() {
    return this.props.clientId;
  }

  get date() {
    return this.props.date;
  }

  set date(date: Date) {
    this.props.date = date;
    this.touch();
  }

  get totalPrice() {
    return this.props.totalPrice;
  }

  set totalPrice(totalPrice: string) {
    this.props.totalPrice = totalPrice;
    this.touch();
  }

  get description() {
    return this.props.description;
  }

  set description(description: string) {
    this.props.description = description;
    this.touch();
  }

  get services() {
    return this.props.services;
  }

  set services(services: Service[]) {
    this.props.services = services;
    this.touch();
  }

  get products() {
    return this.props.products;
  }

  set product(products: Product[]) {
    this.props.products = products;
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
      BookingProps,
      "services" | "products" | "description" | "createdAt"
    >,
    id?: UniqueEntityId
  ) {
    const booking = new Booking(
      {
        ...props,
        services: props.services ?? [],
        products: props.products ?? [],
        description: props.description ?? "",
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );

    return booking;
  }
}
