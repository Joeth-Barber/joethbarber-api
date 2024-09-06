import { Client } from "../../enterprise/entities/client";

export abstract class ClientsRepository {
  abstract delete(client: Client): Promise<void>;
  abstract findById(id: string): Promise<Client | null>;
  abstract findByPhone(phone: string): Promise<Client | null>;
  abstract findByCpf(cpf: string): Promise<Client | null>;
  abstract findByEmail(email: string): Promise<Client | null>;
  abstract create(client: Client): Promise<void>;
}
