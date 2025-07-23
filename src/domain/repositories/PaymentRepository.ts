import Payment from "../entities/Payment";

export default abstract class PaymentRepository {
  abstract create(payment: Payment): Promise<Payment | null>;
  abstract findById(id: number): Promise<Payment | null>;
  abstract modifyStatusPayment(
    id: number,
    status: "pending" | "completed" | "failed"
  ): Promise<Payment | null>;
}
