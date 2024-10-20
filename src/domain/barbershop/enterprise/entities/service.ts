import { Optional } from "@/core/types/optional";
import { Entity } from "src/core/entities/entity";
import { UniqueEntityId } from "src/core/entities/unique-entity-id";

export interface ServiceProps {
  name: string;
  price: number;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Service extends Entity<ServiceProps> {
  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
    this.touch;
  }

  get price() {
    return this.props.price;
  }

  set price(price: number) {
    this.props.price = price;
    this.touch;
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
    props: Optional<ServiceProps, "createdAt">,
    id?: UniqueEntityId
  ) {
    const service = new Service(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );

    return service;
  }
}
