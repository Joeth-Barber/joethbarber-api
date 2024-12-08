import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  WorkSchedule,
  WorkDay,
} from "@/domain/barbershop/enterprise/entities/work-schedule";
import { populateAvailableHours } from "@/utils/work-schedule.utils";
import { randomUUID } from "node:crypto";

export function makeWorkSchedule(
  override: Partial<WorkSchedule> = {},
  id?: UniqueEntityId
) {
  const defaultWorkDays: WorkDay[] = [
    {
      id: new UniqueEntityId(randomUUID()),
      dayOfWeek: 3,
      startTime: "09:00",
      endTime: "22:00",
      breaks: [
        {
          id: new UniqueEntityId(randomUUID()),
          title: "Almoço",
          startTime: "12:00",
          endTime: "13:00",
        },
      ],
      availableHours: [],
    },
  ];

  const workSchedule = WorkSchedule.create(
    {
      barberId: new UniqueEntityId(),
      workDays: populateAvailableHours(defaultWorkDays),
      allowClientsToView: false,
      ...override,
    },
    id
  );

  return workSchedule;
}
