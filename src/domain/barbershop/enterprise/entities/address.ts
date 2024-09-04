import { Entity } from "src/core/entities/entity";
import { UniqueEntityId } from "src/core/entities/unique-entity-id";

export interface AddressProps {
  clientId: UniqueEntityId;
  zipCode: string;
  state: string;
  city: string;
  neighborhood: string;
  address: string;
  number: string;
  updatedAt?: Date | null;
}

export class Address extends Entity<AddressProps> {
  get clientId() {
    return this.props.clientId;
  }

  get zipCode() {
    return this.props.zipCode;
  }

  set zipCode(zipCode: string) {
    this.props.zipCode = zipCode;
    this.touch();
  }

  get state() {
    return this.props.state;
  }

  set state(state: string) {
    this.props.state = state;
    this.touch();
  }

  get city() {
    return this.props.city;
  }

  set city(city: string) {
    this.props.city = city;
    this.touch();
  }

  get neighborhood() {
    return this.props.neighborhood;
  }

  set neighborhood(neighborhood: string) {
    this.props.neighborhood = neighborhood;
    this.touch();
  }

  get address() {
    return this.props.address;
  }

  set address(address: string) {
    this.props.address = address;
    this.touch();
  }

  get number() {
    return this.props.number;
  }

  set number(number: string) {
    this.props.number = number;
    this.touch();
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(props: AddressProps, id?: UniqueEntityId) {
    const address = new Address(
      {
        ...props,
      },
      id
    );

    return address;
  }
}
