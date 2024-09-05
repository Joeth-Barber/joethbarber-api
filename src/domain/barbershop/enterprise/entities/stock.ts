import { Entity } from "src/core/entities/entity";
import { UniqueEntityId } from "src/core/entities/unique-entity-id";
import { Product } from "./product";

export interface StockProps {
  products: Product[];
  updatedAt?: Date | null;
}

export class Stock extends Entity<StockProps> {
  get products() {
    return this.props.products;
  }

  set products(products: Product[]) {
    this.props.products = products;
    this.touch;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(props: StockProps, id?: UniqueEntityId) {
    const stock = new Stock(
      {
        ...props,
      },
      id
    );

    return stock;
  }
}
