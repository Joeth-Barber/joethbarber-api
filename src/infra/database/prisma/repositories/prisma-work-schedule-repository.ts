import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import {
  WorkSchedule,
} from "@/domain/barbershop/enterprise/entities/work-schedule";
import { WorkSchedulesRepository } from "@/domain/barbershop/application/repositories/work-schedules-repository";
import { PrismaWorkScheduleMapper } from "../mappers/prisma-work-schedule-mapper";

@Injectable()
export class PrismaWorkSchedulesRepository implements WorkSchedulesRepository {
  constructor(private prisma: PrismaService) {}

  async findActive(): Promise<WorkSchedule | null> {
    const workSchedule = await this.prisma.workSchedule.findFirst({
      where: { status: "ACTIVE" },
      include: {
        workDays: {
          include: {
            breaks: true,
          },
          orderBy: {
            dayOfWeek: "asc",
          },
        },
      },
    });

    if (!workSchedule) {
      return null;
    }

    return PrismaWorkScheduleMapper.toDomain(workSchedule);
  }

  async save(workSchedule: WorkSchedule): Promise<void> {
    const data = PrismaWorkScheduleMapper.toPrisma(workSchedule);

    await this.prisma.workSchedule.update({
      where: {
        id: data.id?.toString(),
      },
      data,
    });
  }

  async findById(id: string): Promise<WorkSchedule | null> {
    const workSchedule = await this.prisma.workSchedule.findUnique({
      where: { id },
      include: {
        workDays: {
          include: {
            breaks: true,
          },
          orderBy: {
            dayOfWeek: "asc",
          },
        },
      },
    });

    if (!workSchedule) {
      return null;
    }

    return PrismaWorkScheduleMapper.toDomain(workSchedule);
  }

  async create(workSchedule: WorkSchedule): Promise<void> {
    const data = PrismaWorkScheduleMapper.toPrismaForCreate(workSchedule);

    await this.prisma.workSchedule.create({
      data,
    });
  }
}
