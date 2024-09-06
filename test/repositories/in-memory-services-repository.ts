import { PaginationParams } from "@/core/repositories/pagination-params";
import { ServicesRepository } from "@/domain/barbershop/application/repositories/services-repository";
import { Service } from "@/domain/barbershop/enterprise/entities/service";

export class InMemoryServicesRepository implements ServicesRepository {
  public items: Service[] = [];

  async findMany({ page }: PaginationParams) {
    const services = this.items.slice((page - 1) * 10, page * 10);

    return services;
  }

  async delete(service: Service) {
    const itemIndex = this.items.findIndex((item) => item.id === service.id);

    this.items.splice(itemIndex, 1);
  }

  async save(service: Service) {
    const itemIndex = this.items.findIndex((item) => item.id === service.id);

    this.items[itemIndex] = service;
  }

  async findById(id: string) {
    const service = this.items.find((item) => item.id.toString() === id);

    if (!service) {
      return null;
    }

    return service;
  }

  async create(service: Service) {
    this.items.push(service);
  }
}
