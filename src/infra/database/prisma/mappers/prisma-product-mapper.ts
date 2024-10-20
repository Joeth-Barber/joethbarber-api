import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Product } from "@/domain/barbershop/enterprise/entities/product";
import { Prisma, Product as PrismaProduct } from "@prisma/client";

export class PrismaProductMapper {
  static toDomain(raw: PrismaProduct): Product {
    return Product.create(
      {
        name: raw.name,
        price: raw.price,
        quantity: raw.quantity,
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPrisma(product: Product): Prisma.ProductUncheckedCreateInput {
    return {
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      quantity: product.quantity,
    };
  }
}
