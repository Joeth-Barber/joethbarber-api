import { Service } from "@/domain/barbershop/enterprise/entities/service";

export class ServicePresenter {
  static toHTTP(service: Service) {
    return {
      id: service.id.toString(),
      name: service.name,
      price: service.price,
      // createdAt: format(service.createdAt, "dd/MM/yyyy"),
      // updatedAt: service.updatedAt,
    };
  }
}
