import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryWorkSchedulesRepository } from "test/repositories/in-memory-work-schedules-repository";
import { InMemoryBarbersRepository } from "test/repositories/in-memory-barbers-repository";
import { ToggleWorkScheduleStatusUseCase } from "./toggle-work-schedule-status";
import { makeWorkSchedule } from "test/factories/make-work-schedule";
import { makeBarber } from "test/factories/make-barber";

let inMemoryWorkSchedulesRepository: InMemoryWorkSchedulesRepository;
let inMemoryBarbersRepository: InMemoryBarbersRepository;
let sut: ToggleWorkScheduleStatusUseCase;

describe("Toggle Work Schedule Status Use Case", () => {
  beforeEach(() => {
    inMemoryWorkSchedulesRepository = new InMemoryWorkSchedulesRepository();
    inMemoryBarbersRepository = new InMemoryBarbersRepository();
    sut = new ToggleWorkScheduleStatusUseCase(
      inMemoryWorkSchedulesRepository,
      inMemoryBarbersRepository
    );
  });

  it("should toggle status from ACTIVE to DISABLED", async () => {
    await inMemoryBarbersRepository.create(
      makeBarber({}, new UniqueEntityId("barber-01"))
    );

    await inMemoryWorkSchedulesRepository.create(
      makeWorkSchedule(
        { barberId: new UniqueEntityId("barber-01"), status: "ACTIVE" },
        new UniqueEntityId("work-schedule-01")
      )
    );

    const result = await sut.execute({
      workScheduleId: new UniqueEntityId("work-schedule-01"),
      barberId: new UniqueEntityId("barber-01"),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryWorkSchedulesRepository.items[0].status).toBe("DISABLED");
  });

  it("should toggle status from DISABLED to ACTIVE", async () => {
    await inMemoryBarbersRepository.create(
      makeBarber({}, new UniqueEntityId("barber-01"))
    );

    await inMemoryWorkSchedulesRepository.create(
      makeWorkSchedule(
        { barberId: new UniqueEntityId("barber-01"), status: "DISABLED" },
        new UniqueEntityId("work-schedule-01")
      )
    );

    const result = await sut.execute({
      workScheduleId: new UniqueEntityId("work-schedule-01"),
      barberId: new UniqueEntityId("barber-01"),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryWorkSchedulesRepository.items[0].status).toBe("ACTIVE");
  });
});
