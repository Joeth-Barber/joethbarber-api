import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { WorkSchedule } from "@/domain/barbershop/enterprise/entities/work-schedule";
import { Prisma, WorkSchedule as PrismaWorkSchedule } from "@prisma/client";

type RawWorkSchedule = PrismaWorkSchedule & {
  workDays: Array<{
    id: string;
    workScheduleId: string;
    dayOfWeek: number;
    date: string;
    startTime: string;
    endTime: string;
    availableHours: string[];
    breaks: Array<{
      id: string;
      title: string;
      startTime: string;
      endTime: string;
      workDayId: string;
    }>;
  }>;
};

export class PrismaWorkScheduleMapper {
  static toDomain(raw: RawWorkSchedule): WorkSchedule {
    return WorkSchedule.create(
      {
        barberId: new UniqueEntityId(raw.barberId),
        status: raw.status,
        allowClientsToView: raw.allowClientsToView,
        workDays: raw.workDays.map((workDay) => ({
          id: new UniqueEntityId(workDay.id),
          dayOfWeek: workDay.dayOfWeek,
          date: workDay.date,
          startTime: workDay.startTime,
          endTime: workDay.endTime,
          availableHours: workDay.availableHours,
          breaks: workDay.breaks.map((breakItem) => ({
            id: new UniqueEntityId(breakItem.id),
            title: breakItem.title,
            startTime: breakItem.startTime,
            endTime: breakItem.endTime,
          })),
        })),
        createdAt: raw.createdAt,
        activatedAt: raw.activatedAt ?? null,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPrisma(
    workSchedule: WorkSchedule
  ): Prisma.WorkScheduleUncheckedUpdateInput {
    return {
      id: workSchedule.id.toString(),
      barberId: workSchedule.barberId.toString(),
      status: workSchedule.status,
      allowClientsToView: workSchedule.allowClientsToView,
      activatedAt: workSchedule.activatedAt ?? null,
      workDays: {
        update: workSchedule.workDays.map((workDay) => ({
          where: { id: workDay.id?.toString() },
          data: {
            dayOfWeek: workDay.dayOfWeek,
            date: workDay.date,
            startTime: workDay.startTime,
            endTime: workDay.endTime,
            availableHours: {
              set: workDay.availableHours,
            },
            breaks: {
              update: workDay.breaks?.map((breakItem) => ({
                where: { id: breakItem.id?.toString() },
                data: {
                  title: breakItem.title,
                  startTime: breakItem.startTime,
                  endTime: breakItem.endTime,
                },
              })),
            },
          },
        })),
      },
    };
  }

  static toPrismaForCreate(
    workSchedule: WorkSchedule
  ): Prisma.WorkScheduleCreateInput {
    return {
      barber: {
        connect: {
          id: workSchedule.barberId.toString(),
        },
      },
      status: workSchedule.status,
      allowClientsToView: workSchedule.allowClientsToView,
      activatedAt: workSchedule.activatedAt ?? null,
      workDays: {
        create: workSchedule.workDays.map((workDay) => ({
          dayOfWeek: workDay.dayOfWeek,
          date: workDay.date,
          startTime: workDay.startTime,
          endTime: workDay.endTime,
          availableHours: workDay.availableHours,
          breaks: {
            create: workDay.breaks?.map((breakItem) => ({
              title: breakItem.title,
              startTime: breakItem.startTime,
              endTime: breakItem.endTime,
            })),
          },
        })),
      },
    };
  }
}
