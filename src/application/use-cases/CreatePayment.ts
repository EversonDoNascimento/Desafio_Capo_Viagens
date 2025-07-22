import z from "zod";
import Payment from "../../domain/entities/Payment";
import { SchemaCreatePayment } from "../../shared/schemasValidations/PaymentSchemas";
import PaymentRepository from "../../domain/repositories/PaymentRepository";
import { encrypt } from "../../shared/utils/crypt";

export default class CreatePayment {
  constructor(private paymentRepository: PaymentRepository) {
    this.paymentRepository = paymentRepository;
  }

  async execute(
    paymentData: z.infer<typeof SchemaCreatePayment>
  ): Promise<{ id?: number; success: boolean }> {
    const payment = new Payment(paymentData);
    if (payment.getMethod() == "credit_card" && paymentData.card) {
      const infoCardCrypted = {
        encryptedData: encrypt(paymentData.card.encryptedData),
      };
      payment.setCard(infoCardCrypted);
    }
    const created = await this.paymentRepository.create(payment);

    return created;
  }
}
