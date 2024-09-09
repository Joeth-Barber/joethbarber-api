import { InMemoryBookingsRepository } from "test/repositories/in-memory-bookings-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeBooking } from "test/factories/make-booking";
import { CancelBookingUseCase } from "./cancel-booking";

let inMemoryBookingsRepository: InMemoryBookingsRepository;
let sut: CancelBookingUseCase;

describe("Cancel Booking", () => {
  beforeEach(() => {
    inMemoryBookingsRepository = new InMemoryBookingsRepository();
    sut = new CancelBookingUseCase(inMemoryBookingsRepository);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to cancel a booking", async () => {
    const date = new Date("2024-09-10T10:00:00");
    vi.setSystemTime(date);

    const booking = makeBooking(
      {
        clientId: new UniqueEntityId("client-01"),
        date: new Date("2024-09-10T17:00:00"),
      },
      new UniqueEntityId("booking-01")
    );
    inMemoryBookingsRepository.create(booking);
    expect(inMemoryBookingsRepository.items).toHaveLength(1);

    const result = await sut.execute({
      bookingId: new UniqueEntityId("booking-01"),
      clientId: new UniqueEntityId("client-01"),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryBookingsRepository.items[0].status).toBe("CANCELED");
  });

  it("should not be able to cancel a booking after the 3 hours limit", async () => {
    const date = new Date("2024-09-10T14:00:00");
    vi.setSystemTime(date);

    const booking = makeBooking(
      {
        clientId: new UniqueEntityId("client-01"),
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
