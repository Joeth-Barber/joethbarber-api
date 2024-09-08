import { InMemoryBookingsRepository } from "test/repositories/in-memory-bookings-repository";
import { makeBooking } from "test/factories/make-booking";
import { FindBookingByIdUseCase } from "./find-booking-by-id";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeService } from "test/factories/make-service";

let inMemoryBookingsRepository: InMemoryBookingsRepository;
let sut: FindBookingByIdUseCase;

describe("Find Bookings By Id", () => {
  beforeEach(() => {
    inMemoryBookingsRepository = new InMemoryBookingsRepository();
    sut = new FindBookingByIdUseCase(inMemoryBookingsRepository);
  });

  it("should be able to find a booking by id", async () => {
    await inMemoryBookingsRepository.create(
      makeBooking(
        {
          services: [
            makeService({
              name: "Corte de cabelo",
              price: 25.0,
            }),
          ],
        },
        new UniqueEntityId("booking-01")
      )
    );

    await inMemoryBookingsRepository.create(
      makeBooking(
        {
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
        },
        new UniqueEntityId("booking-02")
      )
    );

    expect(inMemoryBookingsRepository.items).toHaveLength(2);

    const result = await sut.execute({
      bookingId: new UniqueEntityId("booking-02"),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      booking: expect.objectContaining({
        totalPrice: 35.0,
      }),
    });
  });
});
