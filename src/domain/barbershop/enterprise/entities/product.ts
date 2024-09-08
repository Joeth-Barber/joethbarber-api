import { Entity } from "src/core/entities/entity";
import { UniqueEntityId } from "src/core/entities/unique-entity-id";

export interface ProductProps {
  name: string;
  price: number;
  quantity: number;
  updatedAt?: Date | null;
}

export class Product extends Entity<ProductProps> {
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

  get quantity() {
    return this.props.quantity;
  }

  set quantity(quantity: number) {
    this.props.quantity = quantity;
    this.touch;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(props: ProductProps, id?: UniqueEntityId) {
    const product = new Product(
      {
        ...props,
      },
      id
    );

    return product;
  }
}
