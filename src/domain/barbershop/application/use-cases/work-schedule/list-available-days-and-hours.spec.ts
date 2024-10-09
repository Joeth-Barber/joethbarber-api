import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryWorkSchedulesRepository } from "test/repositories/in-memory-work-schedules-repository";
import { makeWorkSchedule } from "test/factories/make-work-schedule";
import { makeBarber } from "test/factories/make-barber";
import { InMemoryBarbersRepository } from "test/repositories/in-memory-barbers-repository";
import { FetchAvailableDaysAndHoursUseCase } from "./list-available-days-and-hours";
import { ClientsRepository } from "../../repositories/clients-repository";
import { InMemoryClientsRepository } from "test/repositories/in-memory-clients-repository";
import { makeClient } from "test/factories/make-client";
import { ToggleWorkScheduleStatusUseCase } from "./toggle-work-schedule-status";

let inMemoryWorkSchedulesRepository: InMemoryWorkSchedulesRepository;
let inMemoryBarbersRepository: InMemoryBarbersRepository;
let inMemoryClientsRepository: InMemoryClientsRepository;
let sut: FetchAvailableDaysAndHoursUseCase;
let sutToggle: ToggleWorkScheduleStatusUseCase;

const expectedAvailableDaysAndItHours = {
  availableDaysAndItHours: [
    {
      dayOfWeek: 3,
      startTime: "09:00",
      endTime: "22:00",
      breaks: [{ title: "Almoço", startTime: "12:00", endTime: "13:00" }],
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
      status: true,
    },
  ],
};

const expectedAvailableDaysAndItHoursDisable = {
  availableDaysAndItHours: [
    {
      dayOfWeek: 3,
      startTime: "09:00",
      endTime: "22:00",
      breaks: [{ title: "Almoço", startTime: "12:00", endTime: "13:00" }],
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
      status: false,
    },
  ],
};

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

  it("should be able to list all available days and it hours from a work schedule", async () => {
    await inMemoryBarbersRepository.create(
      makeBarber({}, new UniqueEntityId("barber-01"))
    );
    expect(inMemoryBarbersRepository.items).toHaveLength(1);

    await inMemoryClientsRepository.create(
      makeClient({ role: "MENSALIST" }, new UniqueEntityId("client-01"))
    );
    expect(inMemoryClientsRepository.items).toHaveLength(1);
    //TODO: não posso começar um workSchedule.status como ACTIVE pq tem que começar
    // como DISABLED e só ativar via ToggleWorkScheduleStatusUseCase.

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
        },
        new UniqueEntityId("work-schedule-01")
      )
    );
    expect(inMemoryWorkSchedulesRepository.items).toHaveLength(1);

    sutToggle.execute({
      workScheduleId: new UniqueEntityId("work-schedule-01"),
      barberId: new UniqueEntityId("barber-01"),
    });

    const result = await sut.execute({
      workScheduleId: new UniqueEntityId("work-schedule-01"),
      clientId: new UniqueEntityId("client-01"),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(expectedAvailableDaysAndItHours);
  });

  it("should return available days and hours if client is MENSALIST and work schedule is ACTIVE", async () => {
    await inMemoryClientsRepository.create(
      makeClient({ role: "MENSALIST" }, new UniqueEntityId("client-01"))
    );
    expect(inMemoryClientsRepository.items).toHaveLength(1);

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
              status: true,
            },
          ],
        },
        new UniqueEntityId("work-schedule-01")
      )
    );

    sutToggle.execute({
      workScheduleId: new UniqueEntityId("work-schedule-01"),
      barberId: new UniqueEntityId("barber-01"),
    });

    const result = await sut.execute({
      workScheduleId: new UniqueEntityId("work-schedule-01"),
      clientId: new UniqueEntityId("client-01"),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(expectedAvailableDaysAndItHours);
  });

  it("should set workDay status to false if client is MENSALIST and work schedule is DISABLED", async () => {
    await inMemoryClientsRepository.create(
      makeClient({ role: "MENSALIST" }, new UniqueEntityId("client-01"))
    );
    expect(inMemoryClientsRepository.items).toHaveLength(1);

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
              status: true,
            },
          ],
          status: "DISABLED",
        },
        new UniqueEntityId("work-schedule-01")
      )
    );

    const result = await sut.execute({
      workScheduleId: new UniqueEntityId("work-schedule-01"),
      clientId: new UniqueEntityId("client-01"),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(expectedAvailableDaysAndItHoursDisable);
  });

  it("should return available days and hours if client is CLIENT, work schedule is ACTIVE, and it is after 24 hours", async () => {
    await inMemoryClientsRepository.create(
      makeClient({ role: "CLIENT" }, new UniqueEntityId("client-01"))
    );
    expect(inMemoryClientsRepository.items).toHaveLength(1);

    await inMemoryBarbersRepository.create(
      makeBarber({}, new UniqueEntityId("barber-01"))
    );
    expect(inMemoryBarbersRepository.items).toHaveLength(1);

    //give a work schedule that was activated 25 hours ago
-
    //TODO: ESTOU PASSANDO UM activatedAt pra frente porem está
    // CHEGANDO UM activatedAt diferente lá no list-available-days-and-hours.ts

    const activatedAt = new Date();
    activatedAt.setTime(activatedAt.getTime() - 26 * 60 * 60 * 1000); // Subtract 25 hours in milliseconds
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
          activatedAt: activatedAt,
        },
        new UniqueEntityId("work-schedule-01")
      )
    );

    const result = await sut.execute({
      workScheduleId: new UniqueEntityId("work-schedule-01"),
      clientId: new UniqueEntityId("client-01"),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(expectedAvailableDaysAndItHours);
  });

  it("should set workDay status to false if client is CLIENT, work schedule is ACTIVE, and it is not after 24 hours", async () => {
    await inMemoryClientsRepository.create(
      makeClient({ role: "CLIENT" }, new UniqueEntityId("client-01"))
    );
    expect(inMemoryClientsRepository.items).toHaveLength(1);

    await inMemoryBarbersRepository.create(
      makeBarber({}, new UniqueEntityId("barber-01"))
    );
    expect(inMemoryBarbersRepository.items).toHaveLength(1);

    const activatedAt = new Date();
    activatedAt.setHours(activatedAt.getHours() - 23);

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
          activatedAt: activatedAt,
        },
        new UniqueEntityId("work-schedule-01")
      )
    );

    sutToggle.execute({
      workScheduleId: new UniqueEntityId("work-schedule-01"),
      barberId: new UniqueEntityId("barber-01"),
    });

    const result = await sut.execute({
      workScheduleId: new UniqueEntityId("work-schedule-01"),
      clientId: new UniqueEntityId("client-01"),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(expectedAvailableDaysAndItHoursDisable);
  });

  it("should set workDay status to false if client is CLIENT and work schedule is DISABLED", async () => {
    await inMemoryClientsRepository.create(
      makeClient({ role: "CLIENT" }, new UniqueEntityId("client-01"))
    );
    expect(inMemoryClientsRepository.items).toHaveLength(1);

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
              status: true,
            },
          ],
        },
        new UniqueEntityId("work-schedule-01")
      )
    );

    const result = await sut.execute({
      workScheduleId: new UniqueEntityId("work-schedule-01"),
      clientId: new UniqueEntityId("client-01"),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(expectedAvailableDaysAndItHoursDisable);
  });
});
