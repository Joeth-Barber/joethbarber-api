import { Product } from "@/domain/barbershop/enterprise/entities/product";

export class ProductPresenter {
  static toHTTP(product: Product) {
    return {
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      createdAt: product.createdAt,
    };
  }
}
