import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { FetchServicesUseCase } from "@/domain/barbershop/application/use-cases/services/fetch-services";
import { ServicePresenter } from "../../presenters/service-presenter";

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQuerySchema = z.infer<typeof pageQueryParamSchema>;

@Controller("/service")
export class FetchServicesController {
  constructor(private fetchServices: FetchServicesUseCase) {}

  @Get()
  async handle(@Query("page", queryValidationPipe) page: PageQuerySchema) {
    const result = await this.fetchServices.execute({
      page,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const services = result.value.services;

    return {
      services: services.map(ServicePresenter.toHTTP),
    };
  }
}
