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
import { InMemoryPaymentsRepository } from "test/repositories/in-memory-payments-repository";

let inMemoryBookingsRepository: InMemoryBookingsRepository;
let inMemoryClientsRepository: InMemoryClientsRepository;
let inMemoryPaymentsRepository: InMemoryPaymentsRepository;
let inMemoryWorkSchedulesRepository: InMemoryWorkSchedulesRepository;
let sut: CreateBookingUseCase;

describe("Create Booking", () => {
  beforeEach(() => {
    inMemoryBookingsRepository = new InMemoryBookingsRepository();
    inMemoryClientsRepository = new InMemoryClientsRepository();
    inMemoryPaymentsRepository = new InMemoryPaymentsRepository();
    inMemoryWorkSchedulesRepository = new InMemoryWorkSchedulesRepository();
    sut = new CreateBookingUseCase(
      inMemoryBookingsRepository,
      inMemoryClientsRepository,
      inMemoryPaymentsRepository,
      inMemoryWorkSchedulesRepository
    );
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to create a new booking 14:30", async () => {
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
      date: new Date("2024-09-10T14:30:00"),
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

    const booking1 = makeBooking({
      clientId: new UniqueEntityId("client-01"),
      workScheduleId: new UniqueEntityId("work-schedule-01"),
      date: new Date("2024-09-10T14:00:00"),
    });

    await sut.execute(booking1);

    const booking2 = makeBooking({
      clientId: new UniqueEntityId("client-02"),
      workScheduleId: new UniqueEntityId("work-schedule-01"),
      date: new Date("2024-09-10T14:00:00"),
    });

    const secondBooking = await sut.execute(booking2);

    expect(secondBooking.isLeft()).toBe(true);
    expect(inMemoryBookingsRepository.items).toHaveLength(1);
  });
});
