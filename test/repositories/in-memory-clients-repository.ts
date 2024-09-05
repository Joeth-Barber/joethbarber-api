import { ClientsRepository } from "@/domain/barbershop/application/repositories/clients-repository";
import { Client } from "@/domain/barbershop/enterprise/entities/client";

export class InMemoryClientsRepository implements ClientsRepository {
  public items: Client[] = [];

  async findByPhone(phone: string): Promise<Client | null> {
    const client = this.items.find((item) => item.phone === phone);

    if (!client) {
      return null;
    }

    return client;
  }

  async findByCpf(cpf: string): Promise<Client | null> {
    const client = this.items.find((item) => item.cpf.value === cpf);

    if (!client) {
      return null;
    }

    return client;
  }

  async findByEmail(email: string) {
    const client = this.items.find((item) => item.email === email);

    if (!client) {
      return null;
    }

    return client;
  }

  async create(client: Client) {
    this.items.push(client);
  }
}
