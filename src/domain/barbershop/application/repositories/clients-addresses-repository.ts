import { Address } from "../../enterprise/entities/address";

export abstract class ClientsAddressesRepository {
  abstract findByClientId(clientId: string): Promise<Address | null>;
  abstract create(address: Address): Promise<void>;
}
