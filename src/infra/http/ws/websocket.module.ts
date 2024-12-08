import { Module } from "@nestjs/common";
import { CreateBookingUseCase } from "@/domain/barbershop/application/use-cases/booking/create-booking";
import { BookingGateway } from "./booking-gateway";
import { DatabaseModule } from "@/infra/database/database.module";
import { CancelBookingUseCase } from "@/domain/barbershop/application/use-cases/booking/cancel-booking";

@Module({
  imports: [DatabaseModule],
  providers: [BookingGateway, CreateBookingUseCase, CancelBookingUseCase],
  exports: [BookingGateway],
})
export class WebSocketModule {}
