import { ClientsAddressesRepository } from "@/domain/barbershop/application/repositories/clients-addresses-repository";
import { Address } from "@/domain/barbershop/enterprise/entities/address";

export class InMemoryClientsAddressesRepository
  implements ClientsAddressesRepository
{
  public items: Address[] = [];

  async findByClientId(clientId: string) {
    const address = this.items.find(
      (item) => item.clientId.toString() === clientId
    );

    if (!address) {
      return null;
    }

    return address;
  }

  async create(address: Address) {
    this.items.push(address);
  }
}
