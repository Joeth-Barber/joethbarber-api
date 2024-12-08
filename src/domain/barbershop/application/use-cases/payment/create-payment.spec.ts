import { InMemoryPaymentsRepository } from "test/repositories/in-memory-payments-repository";
import { CreatePaymentUseCase } from "./create-payment";
import { InMemoryClientsRepository } from "test/repositories/in-memory-clients-repository";
import { makePayment } from "test/factories/make-payment";
import { makeClient } from "test/factories/make-client";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryWorkSchedulesRepository } from "test/repositories/in-memory-work-schedules-repository";
import { makeWorkSchedule } from "test/factories/make-work-schedule";
import { InMemoryBookingsRepository } from "test/repositories/in-memory-bookings-repository";
import { makeBooking } from "test/factories/make-booking";
import { makeService } from "test/factories/make-service";

let inMemoryPaymentsRepository: InMemoryPaymentsRepository;
let inMemoryClientsRepository: InMemoryClientsRepository;
let inMemoryBookingsRepository: InMemoryBookingsRepository;
let inMemoryWorkSchedulesRepository: InMemoryWorkSchedulesRepository;
let sut: CreatePaymentUseCase;

describe("Create Payment", () => {
  beforeEach(() => {
    inMemoryPaymentsRepository = new InMemoryPaymentsRepository();
    inMemoryClientsRepository = new InMemoryClientsRepository();
    inMemoryBookingsRepository = new InMemoryBookingsRepository();
    inMemoryWorkSchedulesRepository = new InMemoryWorkSchedulesRepository();
    sut = new CreatePaymentUseCase(
      inMemoryPaymentsRepository,
      inMemoryClientsRepository
    );
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to create a new payment", async () => {
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

    const payment = makePayment({
      clientId: new UniqueEntityId("client-01"),
      bookings: [
        makeBooking(
          {
            clientId: new UniqueEntityId("client-01"),
            workScheduleId: new UniqueEntityId("work-schedule-01"),
            services: [
              makeService({
                name: "Corte de cabelo",
                price: 25,
              }),
              makeService({
                name: "Sobrancelha",
                price: 5,
              }),
              makeService({
                name: "Barba",
                price: 5,
              }),
            ],
          },
          new UniqueEntityId("booking-01")
        ),
      ],
      status: "PENDING",
      paymentDate: new Date("2024-09-10T14:00:00"),
    });

    const result = await sut.execute(payment);

    expect(inMemoryPaymentsRepository.items).toHaveLength(1);

    expect(result.isRight()).toBe(true);
    expect(inMemoryPaymentsRepository.items[0].amount).toBe(35);
  });
});
