import { Service } from "../../enterprise/entities/service";

export abstract class ServicesRepository {
  abstract delete(service: Service): Promise<void>;
  abstract save(service: Service): Promise<void>;
  abstract findById(id: string): Promise<Service | null>;
  abstract create(service: Service): Promise<void>;
}
