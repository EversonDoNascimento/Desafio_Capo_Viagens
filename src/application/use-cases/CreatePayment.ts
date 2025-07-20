import z from "zod";
import Payment from "../../domain/entities/Payment";
import { SchemaCreatePayment } from "../../shared/schemasValidations/PaymentSchemas";
import PaymentRepository from "../../domain/repositories/PaymentRepository";

export default class CreatePayment {
  constructor(private paymentRepository: PaymentRepository) {
    this.paymentRepository = paymentRepository;
  }

  async execute(paymentData: z.infer<typeof SchemaCreatePayment>) {
    const payment = new Payment(paymentData);
    await this.paymentRepository.create(payment);
    return payment;
  }
}
