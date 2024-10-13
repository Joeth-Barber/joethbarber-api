import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryWorkSchedulesRepository } from "test/repositories/in-memory-work-schedules-repository";
import { makeWorkSchedule } from "test/factories/make-work-schedule";
import { makeBarber } from "test/factories/make-barber";
import { InMemoryBarbersRepository } from "test/repositories/in-memory-barbers-repository";
import { FetchAvailableDaysAndHoursUseCase } from "./list-available-days-and-hours";
import { InMemoryClientsRepository } from "test/repositories/in-memory-clients-repository";
import { makeClient } from "test/factories/make-client";
import { ToggleWorkScheduleStatusUseCase } from "./toggle-work-schedule-status";

let inMemoryWorkSchedulesRepository: InMemoryWorkSchedulesRepository;
let inMemoryBarbersRepository: InMemoryBarbersRepository;
let inMemoryClientsRepository: InMemoryClientsRepository;
let sut: FetchAvailableDaysAndHoursUseCase;
let sutToggle: ToggleWorkScheduleStatusUseCase;

describe("List available days and it hours", () => {
  beforeEach(() => {
    inMemoryWorkSchedulesRepository = new InMemoryWorkSchedulesRepository();
    inMemoryBarbersRepository = new InMemoryBarbersRepository();
    inMemoryClientsRepository = new InMemoryClientsRepository();
    sut = new FetchAvailableDaysAndHoursUseCase(
      inMemoryWorkSchedulesRepository,
      inMemoryClientsRepository
    );
    sutToggle = new ToggleWorkScheduleStatusUseCase(
      inMemoryWorkSchedulesRepository,
      inMemoryBarbersRepository
    );
  });

  it("should be able to list all available days and hours from a work schedule, when the client is a mensalist and work schedule status is set to active", async () => {
    await inMemoryBarbersRepository.create(
      makeBarber({}, new UniqueEntityId("barber-01"))
    );
    expect(inMemoryBarbersRepository.items).toHaveLength(1);

    await inMemoryClientsRepository.create(
      makeClient({ role: "MENSALIST" }, new UniqueEntityId("client-01"))
    );
    expect(inMemoryClientsRepository.items).toHaveLength(1);

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
              status: true,
            },
          ],
          allowClientsToView: false,
        },
        new UniqueEntityId("work-schedule-01")
      )
    );
    expect(inMemoryWorkSchedulesRepository.items).toHaveLength(1);

    await sutToggle.execute({
      workScheduleId: new UniqueEntityId("work-schedule-01"),
      barberId: new UniqueEntityId("barber-01"),
    });

    const result = await sut.execute({
      workScheduleId: new UniqueEntityId("work-schedule-01"),
      clientId: new UniqueEntityId("client-01"),
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const availableDaysAndHours = result.value.availableDaysAndHours;

      expect(availableDaysAndHours).toEqual([
        {
          dayOfWeek: 3,
          availableHours: [
            "09:00",
            "09:30",
            "10:00",
            "10:30",
            "11:00",
            "11:30",
            "13:00",
            "13:30",
            "14:00",
            "14:30",
            "15:00",
            "15:30",
            "16:00",
            "16:30",
            "17:00",
            "17:30",
            "18:00",
            "18:30",
            "19:00",
            "19:30",
            "20:00",
            "20:30",
            "21:00",
            "21:30",
          ],
          breaks: [{ title: "Almoço", startTime: "12:00", endTime: "13:00" }],
          startTime: "09:00",
          endTime: "22:00",
          status: true,
        },
      ]);
    }
  });

  it("should not be able to list all available days and hours from a work schedule, when it is a normal client and 'allowClientsToView' is set to false", async () => {
    await inMemoryBarbersRepository.create(
      makeBarber({}, new UniqueEntityId("barber-01"))
    );
    expect(inMemoryBarbersRepository.items).toHaveLength(1);

    await inMemoryClientsRepository.create(
      makeClient({ role: "CLIENT" }, new UniqueEntityId("client-01"))
    );
    expect(inMemoryClientsRepository.items).toHaveLength(1);

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
              status: true,
            },
          ],
          allowClientsToView: false,
        },
        new UniqueEntityId("work-schedule-01")
      )
    );
    expect(inMemoryWorkSchedulesRepository.items).toHaveLength(1);

    await sutToggle.execute({
      workScheduleId: new UniqueEntityId("work-schedule-01"),
      barberId: new UniqueEntityId("barber-01"),
    });

    const result = await sut.execute({
      workScheduleId: new UniqueEntityId("work-schedule-01"),
      clientId: new UniqueEntityId("client-01"),
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const availableDaysAndHours = result.value.availableDaysAndHours;

      expect(availableDaysAndHours).toEqual([
        {
          dayOfWeek: 3,
          availableHours: [
            "09:00",
            "09:30",
            "10:00",
            "10:30",
            "11:00",
            "11:30",
            "13:00",
            "13:30",
            "14:00",
            "14:30",
            "15:00",
            "15:30",
            "16:00",
            "16:30",
            "17:00",
            "17:30",
            "18:00",
            "18:30",
            "19:00",
            "19:30",
            "20:00",
            "20:30",
            "21:00",
            "21:30",
          ],
          breaks: [{ title: "Almoço", startTime: "12:00", endTime: "13:00" }],
          startTime: "09:00",
          endTime: "22:00",
          status: false,
        },
      ]);
    }
  });

  it("should not be able to list all available days and hours from a work schedule when it status is DISABLED and client is MENSALIST", async () => {
    await inMemoryBarbersRepository.create(
      makeBarber({}, new UniqueEntityId("barber-01"))
    );
    expect(inMemoryBarbersRepository.items).toHaveLength(1);

    await inMemoryClientsRepository.create(
      makeClient({ role: "MENSALIST" }, new UniqueEntityId("client-01"))
    );
    expect(inMemoryClientsRepository.items).toHaveLength(1);

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
              status: true,
            },
          ],
          status: "ACTIVE",
        },
        new UniqueEntityId("work-schedule-01")
      )
    );
    expect(inMemoryWorkSchedulesRepository.items).toHaveLength(1);

    await sutToggle.execute({
      workScheduleId: new UniqueEntityId("work-schedule-01"),
      barberId: new UniqueEntityId("barber-01"),
    });

    const result = await sut.execute({
      workScheduleId: new UniqueEntityId("work-schedule-01"),
      clientId: new UniqueEntityId("client-01"),
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const availableDaysAndHours = result.value.availableDaysAndHours;

      expect(availableDaysAndHours).toEqual([
        {
          dayOfWeek: 3,
          availableHours: [
            "09:00",
            "09:30",
            "10:00",
            "10:30",
            "11:00",
            "11:30",
            "13:00",
            "13:30",
            "14:00",
            "14:30",
            "15:00",
            "15:30",
            "16:00",
            "16:30",
            "17:00",
            "17:30",
            "18:00",
            "18:30",
            "19:00",
            "19:30",
            "20:00",
            "20:30",
            "21:00",
            "21:30",
          ],
          breaks: [{ title: "Almoço", startTime: "12:00", endTime: "13:00" }],
          startTime: "09:00",
          endTime: "22:00",
          status: false,
        },
      ]);
    }
  });

  it("should not be able to list all available days and hours from a work schedule when it status is DISABLED and client is CLIENT", async () => {
    await inMemoryBarbersRepository.create(
      makeBarber({}, new UniqueEntityId("barber-01"))
    );
    expect(inMemoryBarbersRepository.items).toHaveLength(1);

    await inMemoryClientsRepository.create(
      makeClient({ role: "CLIENT" }, new UniqueEntityId("client-01"))
    );
    expect(inMemoryClientsRepository.items).toHaveLength(1);

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
              status: true,
            },
          ],
          status: "ACTIVE",
        },
        new UniqueEntityId("work-schedule-01")
      )
    );
    expect(inMemoryWorkSchedulesRepository.items).toHaveLength(1);

    await sutToggle.execute({
      workScheduleId: new UniqueEntityId("work-schedule-01"),
      barberId: new UniqueEntityId("barber-01"),
    });

    const result = await sut.execute({
      workScheduleId: new UniqueEntityId("work-schedule-01"),
      clientId: new UniqueEntityId("client-01"),
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const availableDaysAndHours = result.value.availableDaysAndHours;

      expect(availableDaysAndHours).toEqual([
        {
          dayOfWeek: 3,
          availableHours: [
            "09:00",
            "09:30",
            "10:00",
            "10:30",
            "11:00",
            "11:30",
            "13:00",
            "13:30",
            "14:00",
            "14:30",
            "15:00",
            "15:30",
            "16:00",
            "16:30",
            "17:00",
            "17:30",
            "18:00",
            "18:30",
            "19:00",
            "19:30",
            "20:00",
            "20:30",
            "21:00",
            "21:30",
          ],
          breaks: [{ title: "Almoço", startTime: "12:00", endTime: "13:00" }],
          startTime: "09:00",
          endTime: "22:00",
          status: false,
        },
      ]);
    }
  });
});
