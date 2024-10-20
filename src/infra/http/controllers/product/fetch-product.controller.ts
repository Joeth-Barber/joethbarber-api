import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { FetchProductsUseCase } from "@/domain/barbershop/application/use-cases/products/fetch-products";
import { ProductPresenter } from "../../presenters/product-presenter";

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQuerySchema = z.infer<typeof pageQueryParamSchema>;

@Controller("/find/product")
export class FetchProductsController {
  constructor(private fetchProducts: FetchProductsUseCase) {}

  @Get()
  async handle(@Query("page", queryValidationPipe) page: PageQuerySchema) {
    const result = await this.fetchProducts.execute({
      page,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const products = result.value.products;

    return {
      products: products.map(ProductPresenter.toHTTP),
    };
  }
}
