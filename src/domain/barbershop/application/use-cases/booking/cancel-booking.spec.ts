import { InMemoryBookingsRepository } from "test/repositories/in-memory-bookings-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeBooking } from "test/factories/make-booking";
import { CancelBookingUseCase } from "./cancel-booking";
import { InMemoryWorkSchedulesRepository } from "test/repositories/in-memory-work-schedules-repository";
import { makeWorkSchedule } from "test/factories/make-work-schedule";
import { CreateBookingUseCase } from "./create-booking";
import { InMemoryClientsRepository } from "test/repositories/in-memory-clients-repository";
import { makeClient } from "test/factories/make-client";

let inMemoryBookingsRepository: InMemoryBookingsRepository;
let inMemoryClientsRepository: InMemoryClientsRepository;
let inMemoryWorkSchedulesRepository: InMemoryWorkSchedulesRepository;
let sut: CancelBookingUseCase;
let createBookingUseCase: CreateBookingUseCase;

describe("Cancel Booking", () => {
  beforeEach(() => {
    inMemoryBookingsRepository = new InMemoryBookingsRepository();
    inMemoryClientsRepository = new InMemoryClientsRepository();
    inMemoryWorkSchedulesRepository = new InMemoryWorkSchedulesRepository();

    createBookingUseCase = new CreateBookingUseCase(
      inMemoryBookingsRepository,
      inMemoryClientsRepository,
      inMemoryWorkSchedulesRepository
    );

    sut = new CancelBookingUseCase(
      inMemoryBookingsRepository,
      inMemoryWorkSchedulesRepository
    );
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to cancel a booking and get it date available again", async () => {
    const date = new Date("2024-09-10T10:00:00");
    vi.setSystemTime(date);

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

    await inMemoryClientsRepository.create(
      makeClient({}, new UniqueEntityId("client-01"))
    );

    const booking = makeBooking(
      {
        clientId: new UniqueEntityId("client-01"),
        workScheduleId: new UniqueEntityId("work-schedule-01"),
        date: new Date("2024-09-10T14:00:00"),
      },
      new UniqueEntityId("booking-01")
    );

    const createBookingResult = await createBookingUseCase.execute(booking);
    expect(createBookingResult.isRight()).toBe(true);

    expect(inMemoryBookingsRepository.items).toHaveLength(1);

    const result = await sut.execute({
      bookingId: new UniqueEntityId(
        inMemoryBookingsRepository.items[0].id.toString()
      ),
      clientId: new UniqueEntityId("client-01"),
    });

    expect(result.isRight()).toBe(true);

    expect(inMemoryBookingsRepository.items[0].status).toBe("CANCELED");
  });

  it("should not be able to cancel a booking after the 3 hours limit", async () => {
    const date = new Date("2024-09-10T14:00:00");
    vi.setSystemTime(date);

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

    const booking = makeBooking(
      {
        clientId: new UniqueEntityId("client-01"),
        workScheduleId: new UniqueEntityId("work-schedule-01"),
        date: new Date("2024-09-10T15:00:00"),
      },
      new UniqueEntityId("booking-01")
    );
    inMemoryBookingsRepository.create(booking);
    expect(inMemoryBookingsRepository.items).toHaveLength(1);

    const result = await sut.execute({
      bookingId: new UniqueEntityId("booking-01"),
      clientId: new UniqueEntityId("client-01"),
    });

    expect(result.isLeft()).toBe(true);
  });
});
