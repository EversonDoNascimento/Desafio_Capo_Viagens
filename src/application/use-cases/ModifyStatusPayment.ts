import Payment from "../../domain/entities/Payment";
import PaymentRepository from "../../domain/repositories/PaymentRepository";

export default class ModifyStatusPayment {
  constructor(private paymentRepository: PaymentRepository) {
    this.paymentRepository = paymentRepository;
  }
  async execute(
    id: number,
    status: "pending" | "completed" | "failed"
  ): Promise<Payment | null> {
    // Apenas o ID do pagamento e o status são necessários para modificar o status
    // O status pode ser 'pending', 'completed' ou 'failed'
    return this.paymentRepository.modifyStatusPayment(id, status);
  }
}
