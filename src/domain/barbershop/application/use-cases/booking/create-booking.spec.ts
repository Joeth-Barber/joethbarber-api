import { InMemoryBookingsRepository } from "test/repositories/in-memory-bookings-repository";
import { CreateBookingUseCase } from "./create-booking";
import { InMemoryClientsRepository } from "test/repositories/in-memory-clients-repository";
import { makeBooking } from "test/factories/make-booking";
import { makeClient } from "test/factories/make-client";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeService } from "test/factories/make-service";
import { makeProduct } from "test/factories/make-product";
import { InMemoryWorkSchedulesRepository } from "test/repositories/in-memory-work-schedules-repository";
import { makeWorkSchedule } from "test/factories/make-work-schedule";

let inMemoryBookingsRepository: InMemoryBookingsRepository;
let inMemoryClientsRepository: InMemoryClientsRepository;
let inMemoryWorkSchedulesRepository: InMemoryWorkSchedulesRepository;
let sut: CreateBookingUseCase;

describe("Create Booking", () => {
  beforeEach(() => {
    inMemoryBookingsRepository = new InMemoryBookingsRepository();
    inMemoryClientsRepository = new InMemoryClientsRepository();
    inMemoryWorkSchedulesRepository = new InMemoryWorkSchedulesRepository();
    sut = new CreateBookingUseCase(
      inMemoryBookingsRepository,
      inMemoryClientsRepository,
      inMemoryWorkSchedulesRepository
    );
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to create a new booking", async () => {
    const date = new Date("2024-09-10T10:00:00");
    vi.setSystemTime(date);

    await inMemoryClientsRepository.create(
      makeClient({}, new UniqueEntityId("client-01"))
    );
    expect(inMemoryClientsRepository.items).toHaveLength(1);

    await inMemoryWorkSchedulesRepository.create(
      makeWorkSchedule(
        {
          workDays: [
            {
              dayOfWeek: 2,
              startTime: "09:00",
              endTime: "22:00",
              breaks: [
                {
                  title: "Almoço",
                  startTime: "12:00",
                  endTime: "13:00",
                },
              ],
            },
          ],
        },
        new UniqueEntityId("work-schedule-01")
      )
    );
    expect(inMemoryWorkSchedulesRepository.items).toHaveLength(1);

    const booking = makeBooking({
      clientId: new UniqueEntityId("client-01"),
      workScheduleId: new UniqueEntityId("work-schedule-01"),
      date: new Date("2024-09-10T14:00:00"),
      services: [
        makeService({
          name: "Corte de cabelo",
          price: 25.0,
        }),
        makeService({
          name: "Sobrancelha",
          price: 10.0,
        }),
      ],
      products: [
        makeProduct({
          name: "Coca-cola 400ml",
          price: 5.0,
        }),
      ],
    });

    const result = await sut.execute(booking);

    expect(inMemoryBookingsRepository.items).toHaveLength(1);

    expect(result.isRight()).toBe(true);
    expect(inMemoryBookingsRepository.items[0].totalPrice).toBe(40);
  });

  it("should not be able to create a booking with conflicting dates", async () => {
    const date = new Date("2024-09-10T10:00:00");
    vi.setSystemTime(date);

    await inMemoryClientsRepository.create(
      makeClient({}, new UniqueEntityId("client-01"))
    );

    await inMemoryClientsRepository.create(
      makeClient({}, new UniqueEntityId("client-02"))
    );

    expect(inMemoryClientsRepository.items).toHaveLength(2);

    await inMemoryWorkSchedulesRepository.create(
      makeWorkSchedule(
        {
          workDays: [
            {
              dayOfWeek: 2,
              startTime: "09:00",
              endTime: "22:00",
              breaks: [
                {
                  title: "Almoço",
                  startTime: "12:00",
                  endTime: "13:00",
                },
              ],
            },
          ],
        },
        new UniqueEntityId("work-schedule-01")
      )
    );
    expect(inMemoryWorkSchedulesRepository.items).toHaveLength(1);

    await inMemoryBookingsRepository.create(
      makeBooking({
        clientId: new UniqueEntityId("client-01"),
        workScheduleId: new UniqueEntityId("work-schedule-01"),
        date: new Date("2024-09-10T14:00:00"),
      })
    );

    const booking = makeBooking({
      clientId: new UniqueEntityId("client-02"),
      workScheduleId: new UniqueEntityId("work-schedule-01"),
      date: new Date("2024-09-10T14:00:00"),
    });

    const result = await sut.execute(booking);

    expect(result.isLeft()).toBe(true);
    expect(inMemoryBookingsRepository.items).toHaveLength(1);
  });
});
