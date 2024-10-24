import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { FetchClientsUseCase } from "@/domain/barbershop/application/use-cases/clients/fetch-clients";
import { ClientPresenter } from "../../presenters/client-presenter";

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQuerySchema = z.infer<typeof pageQueryParamSchema>;

@Controller("/find/client")
export class FetchClientsController {
  constructor(private fetchClients: FetchClientsUseCase) {}

  @Get()
  async handle(@Query("page", queryValidationPipe) page: PageQuerySchema) {
    const result = await this.fetchClients.execute({
      page,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const clients = result.value.clients;

    return {
      clients: clients.map(ClientPresenter.toHTTP),
    };
  }
}
