import { Entity } from "src/core/entities/entity";
import { UniqueEntityId } from "src/core/entities/unique-entity-id";
import { Optional } from "src/core/types/optional";
import { WorkSchedule } from "./work-schedule";

export interface BarberProps {
  fullName: string;
  email: string;
  password: string;
  workSchedule: WorkSchedule;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Barber extends Entity<BarberProps> {
  get fullName() {
    return this.props.fullName;
  }

  set fullName(fullName: string) {
    this.props.fullName = fullName;
    this.touch();
  }

  set email(email: string) {
    this.props.email = email;
    this.touch();
  }

  get password() {
    return this.props.password;
  }

  set password(password: string) {
    this.props.password = password;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<BarberProps, "workSchedule" | "createdAt">,
    id?: UniqueEntityId
  ) {
    const barber = new Barber(
      {
        ...props,
        workSchedule: props.workSchedule ?? null,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );

    return barber;
  }
}