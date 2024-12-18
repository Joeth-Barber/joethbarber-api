import { Entity } from "src/core/entities/entity";
import { UniqueEntityId } from "src/core/entities/unique-entity-id";
import { Optional } from "src/core/types/optional";

export interface Break {
  id?: UniqueEntityId;
  title: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

export interface WorkDay {
  id?: UniqueEntityId;
  dayOfWeek: number; // 0 domingo - 6 sábado
  date: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  breaks?: Break[];
  visible?: boolean;
  availableHours?: string[];
}

export interface WorkScheduleProps {
  barberId: UniqueEntityId;
  workDays: WorkDay[];
  status: "ACTIVE" | "DISABLED";
  allowClientsToView: boolean;
  createdAt: Date;
  activatedAt?: Date | null;
  updatedAt?: Date | null;
}

export class WorkSchedule extends Entity<WorkScheduleProps> {
  get barberId() {
    return this.props.barberId;
  }

  get workDays() {
    return this.props.workDays;
  }

  set workDays(workDays: WorkDay[]) {
    this.props.workDays = workDays;
    this.touch();
  }

  get status() {
    return this.props.status;
  }

  set status(status: "ACTIVE" | "DISABLED") {
    this.props.status = status;
    this.touch();
  }

  get allowClientsToView() {
    return this.props.allowClientsToView;
  }

  set allowClientsToView(allowClientsToView: boolean) {
    this.props.allowClientsToView = allowClientsToView;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get activatedAt() {
    return this.props.createdAt;
  }

  set activatedAt(date: Date) {
    this.props.activatedAt = date;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<
      WorkScheduleProps,
      "allowClientsToView" | "createdAt" | "activatedAt" | "status"
    >,
    id?: UniqueEntityId
  ) {
    const workSchedule = new WorkSchedule(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        activatedAt: props.activatedAt ?? null,
        allowClientsToView: props.allowClientsToView ?? false,
        status: props.status ?? "DISABLED",
      },
      id
    );

    return workSchedule;
  }
}
