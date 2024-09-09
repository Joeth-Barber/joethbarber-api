import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryWorkSchedulesRepository } from "test/repositories/in-memory-work-schedules-repository";
import { CreateWorkScheduleUseCase } from "./create-work-schedule";
import { makeWorkSchedule } from "test/factories/make-work-schedule";
import { makeBarber } from "test/factories/make-barber";
import { InMemoryBarbersRepository } from "test/repositories/in-memory-barbers-repository";

let inMemoryWorkSchedulesRepository: InMemoryWorkSchedulesRepository;
let inMemoryBarbersRepository: InMemoryBarbersRepository;
let sut: CreateWorkScheduleUseCase;

describe("Create Work Schedule", () => {
  beforeEach(() => {
    inMemoryWorkSchedulesRepository = new InMemoryWorkSchedulesRepository();
    inMemoryBarbersRepository = new InMemoryBarbersRepository();
    sut = new CreateWorkScheduleUseCase(inMemoryWorkSchedulesRepository);
  });

  it("should be able to create a new work schedule", async () => {
    await inMemoryBarbersRepository.create(
      makeBarber({}, new UniqueEntityId("barber-01"))
    );
    expect(inMemoryBarbersRepository.items).toHaveLength(1);

    const workSchedule = makeWorkSchedule({
      barberId: new UniqueEntityId("barber-01"),
      workDays: [
        {
          dayOfWeek: 3,
          startTime: "09:00",
          endTime: "22:00",
          breaks: [{ title: "Almoço", startTime: "12:00", endTime: "13:00" }],
          availableHours: [],
        },
      ],
    });

    const result = await sut.execute({
      barberId: new UniqueEntityId("barber-01"),
      workDays: workSchedule.workDays,
      status: "ACTIVE",
    });

    expect(inMemoryWorkSchedulesRepository.items).toHaveLength(1);

    expect(result.isRight()).toBe(true);
  });
});
