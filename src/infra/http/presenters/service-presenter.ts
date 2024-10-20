import { Service } from "@/domain/barbershop/enterprise/entities/service";

export class ServicePresenter {
  static toHTTP(service: Service) {
    return {
      id: service.id.toString(),
      role: service.name,
      price: service.price,
      createdAt: service.createdAt,
    };
  }
}
