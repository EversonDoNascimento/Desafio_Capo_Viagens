import Payment from "../../domain/entities/Payment";
import PaymentRepository from "../../domain/repositories/PaymentRepository";

export class FindPaymentById {
  constructor(private paymentRepository: PaymentRepository) {
    this.paymentRepository = paymentRepository;
  }
  async execute(id: number): Promise<Payment | null> {
    // busca o pagamento pelo ID
    return await this.paymentRepository.findById(id);
  }
}
