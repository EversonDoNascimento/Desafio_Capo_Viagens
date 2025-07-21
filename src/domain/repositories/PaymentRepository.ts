import Payment from "../entities/Payment";

export default abstract class PaymentRepository {
  abstract create(payment: Payment): Promise<{ id?: number; success: boolean }>;
  abstract findById(id: number): Promise<Payment | null>;
}
