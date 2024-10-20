import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { ProductsRepository } from "@/domain/barbershop/application/repositories/products-repository";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { Product } from "@/domain/barbershop/enterprise/entities/product";
import { PrismaProductMapper } from "../mappers/prisma-product-mapper";

@Injectable()
export class PrismaProductsRepository implements ProductsRepository {
  constructor(private prisma: PrismaService) {}

  async delete(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPrisma(product);

    await this.prisma.product.delete({
      where: {
        id: data.id,
      },
    });
  }

  async save(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPrisma(product);

    await this.prisma.product.update({
      where: {
        id: data.id,
      },
      data,
    });
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      return null;
    }

    return PrismaProductMapper.toDomain(product);
  }

  async findMany({ page }: PaginationParams): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      skip: (page - 1) * 10,
    });

    return products.map(PrismaProductMapper.toDomain);
  }

  async create(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPrisma(product);

    await this.prisma.product.create({
      data,
    });
  }
}
