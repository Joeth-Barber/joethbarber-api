import { ClientsRepository } from "@/domain/barbershop/application/repositories/clients-repository";
import { Client } from "@/domain/barbershop/enterprise/entities/client";

export class InMemoryClientsRepository implements ClientsRepository {
  public items: Client[] = [];

  async delete(client: Client) {
    const itemIndex = this.items.findIndex((item) => item.id === client.id);

    this.items.splice(itemIndex, 1);
  }

  async findById(id: string) {
    const client = this.items.find((item) => item.id.toString() === id);

    if (!client) {
      return null;
    }

    return client;
  }

  async findByPhone(phone: string) {
    const client = this.items.find((item) => item.phone === phone);

    if (!client) {
      return null;
    }

    return client;
  }

  async findByCpf(cpf: string) {
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
