// import { InMemoryBookingsRepository } from "test/repositories/in-memory-bookings-repository";
// import { CreateBookingUseCase } from "./create-booking";
// import { InMemoryClientsRepository } from "test/repositories/in-memory-clients-repository";
// import { InMemoryWorkSchedulesRepository } from "test/repositories/in-memory-work-schedules-repository";
// import { InMemoryPaymentsRepository } from "test/repositories/in-memory-payments-repository";
// import { InMemoryServicesRepository } from "test/repositories/in-memory-services-repository";
// import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";

// let inMemoryBookingsRepository: InMemoryBookingsRepository;
// let inMemoryClientsRepository: InMemoryClientsRepository;
// let inMemoryPaymentsRepository: InMemoryPaymentsRepository;
// let inMemoryWorkSchedulesRepository: InMemoryWorkSchedulesRepository;
// let inMemoryServicesRepository: InMemoryServicesRepository;
// let inMemoryProductsRepository: InMemoryProductsRepository;
// let sut: CreateBookingUseCase;

// describe("Create Booking", () => {
//   beforeEach(() => {
//     inMemoryBookingsRepository = new InMemoryBookingsRepository();
//     inMemoryClientsRepository = new InMemoryClientsRepository();
//     inMemoryPaymentsRepository = new InMemoryPaymentsRepository();
//     inMemoryWorkSchedulesRepository = new InMemoryWorkSchedulesRepository();
//     inMemoryServicesRepository = new InMemoryServicesRepository();
//     inMemoryProductsRepository = new InMemoryProductsRepository();
//     sut = new CreateBookingUseCase(
//       inMemoryBookingsRepository,
//       inMemoryClientsRepository,
//       inMemoryPaymentsRepository,
//       inMemoryWorkSchedulesRepository,
//       inMemoryServicesRepository,
//       inMemoryProductsRepository
//     );
//     vi.useFakeTimers();
//   });

//   afterEach(() => {
//     vi.useRealTimers();
//   });
// });
