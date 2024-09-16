import { InMemoryBookingsRepository } from "test/repositories/in-memory-bookings-repository";
import { makeBooking } from "test/factories/make-booking";
import { FetchClientBookingsUseCase } from "./fetch-bookings-by-client-id";
import { InMemoryClientsRepository } from "test/repositories/in-memory-clients-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeClient } from "test/factories/make-client";

let inMemoryBookingsRepository: InMemoryBookingsRepository;
let inMemoryClientsRepository: InMemoryClientsRepository;
let sut: FetchClientBookingsUseCase;

describe("Fetch Client Bookings By Id", () => {
  beforeEach(() => {
    inMemoryBookingsRepository = new InMemoryBookingsRepository();
    inMemoryClientsRepository = new InMemoryClientsRepository();
    sut = new FetchClientBookingsUseCase(
      inMemoryBookingsRepository,
      inMemoryClientsRepository
    );
  });

  it("should be able to fetch all client bookings by id", async () => {
    await inMemoryClientsRepository.create(
      makeClient({}, new UniqueEntityId("client-01"))
    );

    await inMemoryBookingsRepository.create(
      makeBooking({
        date: new Date("2024-09-10T14:00:00"),
        clientId: new UniqueEntityId("client-01"),
      })
    );
    await inMemoryBookingsRepository.create(
      makeBooking({
        date: new Date("2024-09-10T14:30:00"),
        clientId: new UniqueEntityId("client-01"),
      })
    );
    await inMemoryBookingsRepository.create(
      makeBooking({
        date: new Date("2024-09-10T15:00:00"),
        clientId: new UniqueEntityId("client-01"),
      })
    );
    expect(inMemoryBookingsRepository.items).toHaveLength(3);

    const result = await sut.execute({
      page: 1,
      clientId: new UniqueEntityId("client-01"),
    });

    expect(result.isRight()).toBe(true);

    expect(result.value).toEqual({
      bookings: expect.arrayContaining([
        expect.objectContaining({ date: new Date("2024-09-10T14:00:00") }),
        expect.objectContaining({ date: new Date("2024-09-10T14:30:00") }),
        expect.objectContaining({ date: new Date("2024-09-10T15:00:00") }),
      ]),
    });
  });

  it("should be able to fetch paginated list of client bookings", async () => {
    await inMemoryClientsRepository.create(
      makeClient({}, new UniqueEntityId("client-01"))
    );

    for (let i = 1; i <= 12; i++) {
      await inMemoryBookingsRepository.create(
        makeBooking({
          clientId: new UniqueEntityId("client-01"),
        })
      );
    }

    const result = await sut.execute({
      page: 2,
      clientId: new UniqueEntityId("client-01"),
    });

    expect(result.value).toEqual({
      bookings: expect.arrayContaining([
        expect.objectContaining({ date: expect.any(Date) }),
        expect.objectContaining({ date: expect.any(Date) }),
      ]),
    });
  });
});
