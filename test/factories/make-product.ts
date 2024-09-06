import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  Product,
  ProductProps,
} from "@/domain/barbershop/enterprise/entities/product";
import { faker } from "@faker-js/faker";

export function makeProduct(
  override: Partial<ProductProps> = {},
  id?: UniqueEntityId
) {
  const product = Product.create(
    {
      name: faker.commerce.product(),
      price: faker.commerce.productName(),
      quantity: faker.number.int(),
      ...override,
    },
    id
  );

  return product;
}
