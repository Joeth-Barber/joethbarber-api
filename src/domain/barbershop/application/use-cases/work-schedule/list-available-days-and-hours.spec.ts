import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryWorkSchedulesRepository } from "test/repositories/in-memory-work-schedules-repository";
import { makeWorkSchedule } from "test/factories/make-work-schedule";
import { makeBarber } from "test/factories/make-barber";
import { InMemoryBarbersRepository } from "test/repositories/in-memory-barbers-repository";
import { FetchAvailableDaysAndHoursUseCase } from "./list-available-days-and-hours";

let inMemoryWorkSchedulesRepository: InMemoryWorkSchedulesRepository;
let inMemoryBarbersRepository: InMemoryBarbersRepository;
let sut: FetchAvailableDaysAndHoursUseCase;

describe("List available days and it hours", () => {
  beforeEach(() => {
    inMemoryWorkSchedulesRepository = new InMemoryWorkSchedulesRepository();
    inMemoryBarbersRepository = new InMemoryBarbersRepository();
    sut = new FetchAvailableDaysAndHoursUseCase(
      inMemoryWorkSchedulesRepository
    );
  });

  it("should be able to list all available days and it hours from a work schedule", async () => {
    await inMemoryBarbersRepository.create(
      makeBarber({}, new UniqueEntityId("barber-01"))
    );
    expect(inMemoryBarbersRepository.items).toHaveLength(1);

    await inMemoryWorkSchedulesRepository.create(
      makeWorkSchedule(
        {
          barberId: new UniqueEntityId("barber-01"),
          workDays: [
            {
              dayOfWeek: 3,
              startTime: "09:00",
              endTime: "22:00",
              breaks: [
                { title: "Almoço", startTime: "12:00", endTime: "13:00" },
              ],
              availableHours: [],
            },
            {
              dayOfWeek: 4,
              startTime: "10:00",
              endTime: "20:00",
              breaks: [
                { title: "Almoço", startTime: "12:00", endTime: "13:00" },
              ],
              availableHours: [],
            },
            {
              dayOfWeek: 5,
              startTime: "09:00",
              endTime: "22:00",
              breaks: [
                { title: "Janta", startTime: "18:00", endTime: "20:00" },
              ],
              availableHours: [],
            },
          ],
        },
        new UniqueEntityId("work-schedule-01")
      )
    );
    expect(inMemoryWorkSchedulesRepository.items).toHaveLength(1);

    const result = await sut.execute({
      workScheduleId: new UniqueEntityId("work-schedule-01"),
    });

    expect(result.isRight()).toBe(true);
  });
});
