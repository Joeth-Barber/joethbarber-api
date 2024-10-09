import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  WorkSchedule,
  WorkDay,
} from "@/domain/barbershop/enterprise/entities/work-schedule";
import { populateAvailableHours } from "@/utils/work-schedule.utils";

export function makeWorkSchedule(
  override: Partial<WorkSchedule> = {},
  id?: UniqueEntityId
) {
  const defaultWorkDays: WorkDay[] = [
    {
      dayOfWeek: 3,
      startTime: "09:00",
      endTime: "22:00",
      breaks: [
        {
          title: "Almoço",
          startTime: "12:00",
          endTime: "13:00",
        },
      ],
      availableHours: [],
      status: true,
    },
  ];

  const workSchedule = WorkSchedule.create(
    {
      barberId: new UniqueEntityId(),
      workDays: populateAvailableHours(defaultWorkDays),
      ...override,
    },
    id
  );

  return workSchedule;
}
