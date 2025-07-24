import Payment from "../entities/Payment";

// Classe abstrata PaymentRepository
export default abstract class PaymentRepository {
  // Método para criar um novo pagamento
  abstract create(payment: Payment): Promise<Payment | null>;
  // Método para buscar um pagamento pelo ID
  abstract findById(id: number): Promise<Payment | null>;
  // Método para modificar o status de um pagamento
  abstract modifyStatusPayment(
    id: number,
    status: "pending" | "completed" | "failed"
  ): Promise<Payment | null>;
}
