import {
  WorkDay,
  Break,
} from "@/domain/barbershop/enterprise/entities/work-schedule";

export function populateAvailableHours(workDays: WorkDay[]): WorkDay[] {
  return workDays.map((workDay) => {
    const availableHours: string[] = [];
    const { startTime, endTime, breaks = [] } = workDay;

    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);

    function addHour(time: Date): Date {
      return new Date(time.getTime() + 60 * 60 * 1000);
    }

    function isDuringBreak(time: Date): boolean {
      return breaks.some(
        (brk: Break) =>
          time >= new Date(`1970-01-01T${brk.startTime}:00`) &&
          time < new Date(`1970-01-01T${brk.endTime}:00`)
      );
    }

    let currentTime = start;
    const endHour = new Date(end.getTime() - 60 * 60 * 1000);

    while (currentTime <= endHour) {
      const currentTimeStr = currentTime.toTimeString().substring(0, 5);

      if (!isDuringBreak(currentTime)) {
        availableHours.push(currentTimeStr);
      }

      currentTime = addHour(currentTime);
    }

    const endTimeStr = endHour.toTimeString().substring(0, 5);
    if (!isDuringBreak(end) && !availableHours.includes(endTimeStr)) {
      availableHours.push(endTimeStr);
    }

    return {
      ...workDay,
      availableHours: availableHours.sort(),
    };
  });
}
