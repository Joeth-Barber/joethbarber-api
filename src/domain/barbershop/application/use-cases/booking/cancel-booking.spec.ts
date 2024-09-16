import { InMemoryBookingsRepository } from "test/repositories/in-memory-bookings-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeBooking } from "test/factories/make-booking";
import { CancelBookingUseCase } from "./cancel-booking";
import { InMemoryWorkSchedulesRepository } from "test/repositories/in-memory-work-schedules-repository";
import { makeWorkSchedule } from "test/factories/make-work-schedule";
import { CreateBookingUseCase } from "./create-booking";
import { InMemoryClientsRepository } from "test/repositories/in-memory-clients-repository";
import { makeClient } from "test/factories/make-client";
import { InMemoryPaymentsRepository } from "test/repositories/in-memory-payments-repository";
import { makeService } from "test/factories/make-service";
import { CreatePaymentUseCase } from "../payment/create-payment";

let inMemoryBookingsRepository: InMemoryBookingsRepository;
let inMemoryClientsRepository: InMemoryClientsRepository;
let inMemoryPaymentsRepository: InMemoryPaymentsRepository;
let inMemoryWorkSchedulesRepository: InMemoryWorkSchedulesRepository;
let createBookingUseCase: CreateBookingUseCase;
let sut: CancelBookingUseCase;

describe("Cancel Booking", () => {
  beforeEach(() => {
    inMemoryBookingsRepository = new InMemoryBookingsRepository();
    inMemoryClientsRepository = new InMemoryClientsRepository();
    inMemoryPaymentsRepository = new InMemoryPaymentsRepository();
    inMemoryWorkSchedulesRepository = new InMemoryWorkSchedulesRepository();

    createBookingUseCase = new CreateBookingUseCase(
      inMemoryBookingsRepository,
      inMemoryClientsRepository,
      inMemoryPaymentsRepository,
      inMemoryWorkSchedulesRepository
    );

    sut = new CancelBookingUseCase(
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

  it("should be able to cancel a booking and remove its totalPrice from a mensalist payment amount", async () => {
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
      makeClient(
        {
          role: "MENSALIST",
        },
        new UniqueEntityId("client-01")
      )
    );

    const booking = makeBooking(
      {
        clientId: new UniqueEntityId("client-01"),
        workScheduleId: new UniqueEntityId("work-schedule-01"),
        date: new Date("2024-09-10T14:00:00"),
        services: [
          makeService({
            name: "Corte de cabelo",
            price: 30,
          }),
        ],
      },
      new UniqueEntityId("booking-01")
    );

    const createBookingResult = await createBookingUseCase.execute(booking);
    expect(createBookingResult.isRight()).toBe(true);

    const clientPaymentBeforeCancellation =
      await inMemoryPaymentsRepository.findLatestByClientId("client-01");

    expect(clientPaymentBeforeCancellation).not.toBeNull();
    expect(clientPaymentBeforeCancellation?.amount).toBe(30);

    expect(inMemoryBookingsRepository.items).toHaveLength(1);
    expect(inMemoryPaymentsRepository.items).toHaveLength(1);

    if (createBookingResult.isRight()) {
      const bookingId = createBookingResult.value.booking.id.toString();

      const cancelBookingResult = await sut.execute({
        bookingId: new UniqueEntityId(bookingId),
        clientId: new UniqueEntityId("client-01"),
      });

      expect(cancelBookingResult.isRight()).toBe(true);
    }

    expect(inMemoryBookingsRepository.items[0].status).toBe("CANCELED");

    const clientPaymentAfterCancellation =
      await inMemoryPaymentsRepository.findLatestByClientId("client-01");
    expect(clientPaymentAfterCancellation).not.toBeNull();
    expect(clientPaymentAfterCancellation?.amount).toBe(0);
  });
});
