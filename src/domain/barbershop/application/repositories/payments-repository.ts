import { PaginationParams } from "@/core/repositories/pagination-params";
import { Payment } from "../../enterprise/entities/payment";

export abstract class PaymentsRepository {
  abstract save(payment: Payment): Promise<void>;
  abstract findById(id: string): Promise<Payment | null>;
  abstract fetchByClientId(
    params: PaginationParams,
    id: string
  ): Promise<Payment[]>;
  abstract create(payment: Payment): Promise<void>;
}
