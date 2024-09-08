import { InMemoryBookingsRepository } from "test/repositories/in-memory-bookings-repository";
import { CreateBookingUseCase } from "./create-booking";
import { InMemoryClientsRepository } from "test/repositories/in-memory-clients-repository";
import { makeBooking } from "test/factories/make-booking";
import { makeClient } from "test/factories/make-client";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeService } from "test/factories/make-service";
import { makeProduct } from "test/factories/make-product";

let inMemoryBookingsRepository: InMemoryBookingsRepository;
let inMemoryClientsRepository: InMemoryClientsRepository;
let sut: CreateBookingUseCase;

describe("Create Booking", () => {
  beforeEach(() => {
    inMemoryBookingsRepository = new InMemoryBookingsRepository();
    inMemoryClientsRepository = new InMemoryClientsRepository();
    sut = new CreateBookingUseCase(
      inMemoryBookingsRepository,
      inMemoryClientsRepository
    );
  });

  it("should be able to create a new booking", async () => {
    await inMemoryClientsRepository.create(
      makeClient({}, new UniqueEntityId("client-01"))
    );
    expect(inMemoryClientsRepository.items).toHaveLength(1);

    const booking = makeBooking({
      clientId: new UniqueEntityId("client-01"),
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
    await inMemoryClientsRepository.create(
      makeClient({}, new UniqueEntityId("client-01"))
    );
    expect(inMemoryClientsRepository.items).toHaveLength(1);

    await inMemoryBookingsRepository.create(
      makeBooking({
        date: new Date("2024-09-10T14:00:00"),
      })
    );

    const booking = makeBooking({
      clientId: new UniqueEntityId("client-01"),
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

    expect(result.isLeft()).toBe(true);
    expect(inMemoryBookingsRepository.items).toHaveLength(1);
  });
});
