import { Product } from "@/domain/barbershop/enterprise/entities/product";
import { format } from "date-fns";

export class ProductPresenter {
  static toHTTP(product: Product) {
    return {
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      // createdAt: format(product.createdAt, "dd/MM/yyyy"),
      // updatedAt: product.updatedAt,
    };
  }
}
