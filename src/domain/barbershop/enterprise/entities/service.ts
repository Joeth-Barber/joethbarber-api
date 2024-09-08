import { Entity } from "src/core/entities/entity";
import { UniqueEntityId } from "src/core/entities/unique-entity-id";

export interface ServiceProps {
  name: string;
  price: number;
}

export class Service extends Entity<ServiceProps> {
  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get price() {
    return this.props.price;
  }

  set price(price: number) {
    this.props.price = price;
  }

  static create(props: ServiceProps, id?: UniqueEntityId) {
    const service = new Service(
      {
        ...props,
      },
      id
    );

    return service;
  }
}
