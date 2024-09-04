import { Entity } from "src/core/entities/entity";
import { UniqueEntityId } from "src/core/entities/unique-entity-id";
import { Optional } from "src/core/types/optional";

export interface WorkScheduleProps {
  barberId: UniqueEntityId;
  dayOfWeek: Date;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class WorkSchedule extends Entity<WorkScheduleProps> {
  get barberId() {
    return this.props.barberId;
  }

  get dayOfWeek() {
    return this.props.dayOfWeek;
  }

  set dayOfWeek(dayOfWeek: Date) {
    this.props.dayOfWeek = dayOfWeek;
    this.touch();
  }

  get startTime() {
    return this.props.startTime;
  }

  set startTime(startTime: Date) {
    this.props.startTime = startTime;
    this.touch();
  }

  get endTime() {
    return this.props.endTime;
  }

  set endTime(endTime: Date) {
    this.props.endTime = endTime;
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
    props: Optional<WorkScheduleProps, "createdAt">,
    id?: UniqueEntityId
  ) {
    const workSchedule = new WorkSchedule(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );

    return workSchedule;
  }
}
