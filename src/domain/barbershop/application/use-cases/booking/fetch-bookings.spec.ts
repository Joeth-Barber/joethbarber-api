import { InMemoryBookingsRepository } from "test/repositories/in-memory-bookings-repository";
import { makeBooking } from "test/factories/make-booking";
import { FetchBookingsUseCase } from "./fetch-bookings";

let inMemoryBookingsRepository: InMemoryBookingsRepository;
let sut: FetchBookingsUseCase;

describe("Fetch Bookings", () => {
  beforeEach(() => {
    inMemoryBookingsRepository = new InMemoryBookingsRepository();
    sut = new FetchBookingsUseCase(inMemoryBookingsRepository);
  });

  it("should be able to fetch a list of bookings", async () => {
    await inMemoryBookingsRepository.create(
      makeBooking({
        date: new Date("2024-09-10T14:00:00"),
      })
    );
    await inMemoryBookingsRepository.create(
      makeBooking({
        date: new Date("2024-09-10T14:30:00"),
      })
    );
    await inMemoryBookingsRepository.create(
      makeBooking({
        date: new Date("2024-09-10T15:00:00"),
      })
    );
    expect(inMemoryBookingsRepository.items).toHaveLength(3);

    const result = await sut.execute({
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.bookings).toEqual([
      expect.objectContaining({ date: new Date("2024-09-10T14:00:00") }),
      expect.objectContaining({ date: new Date("2024-09-10T14:30:00") }),
      expect.objectContaining({ date: new Date("2024-09-10T15:00:00") }),
    ]);
  });

  it("should be able to fetch paginated list of bookings", async () => {
    for (let i = 1; i <= 12; i++) {
      await inMemoryBookingsRepository.create(makeBooking());
    }

    const result = await sut.execute({
      page: 2,
    });

    expect(result.value?.bookings).toHaveLength(2);
  });
});
