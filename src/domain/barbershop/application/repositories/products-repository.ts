import { PaginationParams } from "@/core/repositories/pagination-params";
import { Product } from "../../enterprise/entities/product";

export abstract class ProductsRepository {
  abstract delete(product: Product): Promise<void>;
  abstract save(product: Product): Promise<void>;
  abstract findById(id: string): Promise<Product | null>;
  abstract findMany(params: PaginationParams): Promise<Product[]>;
  abstract create(product: Product): Promise<void>;
}
