import { InMemoryPaymentsRepository } from "test/repositories/in-memory-payments-repository";
import { InMemoryClientsRepository } from "test/repositories/in-memory-clients-repository";
import { makePayment } from "test/factories/make-payment";
import { makeClient } from "test/factories/make-client";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryWorkSchedulesRepository } from "test/repositories/in-memory-work-schedules-repository";
import { makeWorkSchedule } from "test/factories/make-work-schedule";
import { InMemoryBookingsRepository } from "test/repositories/in-memory-bookings-repository";
import { makeBooking } from "test/factories/make-booking";
import { makeService } from "test/factories/make-service";
import { FetchPaymentsByClientIdUseCase } from "./fetch-payments-by-client-id";
import { makeProduct } from "test/factories/make-product";

let inMemoryPaymentsRepository: InMemoryPaymentsRepository;
let inMemoryClientsRepository: InMemoryClientsRepository;
let inMemoryBookingsRepository: InMemoryBookingsRepository;
let inMemoryWorkSchedulesRepository: InMemoryWorkSchedulesRepository;
let sut: FetchPaymentsByClientIdUseCase;

describe("Fetch Payments By Client Id", () => {
  beforeEach(() => {
    inMemoryPaymentsRepository = new InMemoryPaymentsRepository();
    inMemoryClientsRepository = new InMemoryClientsRepository();
    inMemoryBookingsRepository = new InMemoryBookingsRepository();
    inMemoryWorkSchedulesRepository = new InMemoryWorkSchedulesRepository();
    sut = new FetchPaymentsByClientIdUseCase(
      inMemoryPaymentsRepository,
      inMemoryClientsRepository
    );
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to fetch all client payments by id", async () => {
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

    await inMemoryPaymentsRepository.create(
      makePayment({
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
              ],
            },
            new UniqueEntityId("booking-01")
          ),
        ],
        status: "COMPLETED",
        paymentDate: new Date("2024-09-10T14:00:00"),
      })
    );

    await inMemoryPaymentsRepository.create(
      makePayment({
        clientId: new UniqueEntityId("client-01"),
        products: [
          makeProduct({
            name: "Coca-cola 400ml",
            price: 5,
          }),
        ],
        status: "COMPLETED",
        paymentDate: new Date("2024-05-22T17:00:00"),
      })
    );

    expect(inMemoryPaymentsRepository.items).toHaveLength(2);

    const result = await sut.execute({
      page: 1,
      clientId: new UniqueEntityId("client-01"),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      payments: expect.any(Array),
    });
  });

  it("should be able to fetch paginated list of client payments", async () => {
    await inMemoryClientsRepository.create(
      makeClient({}, new UniqueEntityId("client-01"))
    );

    for (let i = 1; i <= 12; i++) {
      await inMemoryPaymentsRepository.create(
        makePayment({ clientId: new UniqueEntityId("client-01"), amount: 50 })
      );
    }

    const result = await sut.execute({
      page: 2,
      clientId: new UniqueEntityId("client-01"),
    });

    if (result.isRight()) {
      const payments = result.value.payments;
      expect(payments).toHaveLength(2);
    }
  });
});
