import { PaginationParams } from "@/core/repositories/pagination-params";
import { ProductsRepository } from "@/domain/barbershop/application/repositories/products-repository";
import { Product } from "@/domain/barbershop/enterprise/entities/product";

export class InMemoryProductsRepository implements ProductsRepository {
  public items: Product[] = [];

  async findMany({ page }: PaginationParams) {
    const products = this.items.slice((page - 1) * 10, page * 10);

    return products;
  }

  async delete(product: Product) {
    const itemIndex = this.items.findIndex((item) => item.id === product.id);

    this.items.splice(itemIndex, 1);
  }

  async save(product: Product) {
    const itemIndex = this.items.findIndex((item) => item.id === product.id);

    this.items[itemIndex] = product;
  }

  async findById(id: string) {
    const product = this.items.find((item) => item.id.toString() === id);

    if (!product) {
      return null;
    }

    return product;
  }

  async create(product: Product) {
    this.items.push(product);
  }
}
