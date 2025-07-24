import z from "zod";
import Payment from "../../domain/entities/Payment";
import { SchemaCreatePayment } from "../../shared/schemasValidations/PaymentSchemas";
import PaymentRepository from "../../domain/repositories/PaymentRepository";
import { encrypt } from "../../shared/utils/crypt";

export default class CreatePayment {
  // o constructor recebe o repositório de pagamentos como argumento
  constructor(private paymentRepository: PaymentRepository) {
    this.paymentRepository = paymentRepository;
  }
  // o execute recebe os dados do pagamento como argumento
  async execute(
    paymentData: z.infer<typeof SchemaCreatePayment>
  ): Promise<Payment | null> {
    const payment = new Payment(paymentData);
    // Se o pagamento for credit_card, criptografa os dados do cartão
    if (payment.getMethod() == "credit_card" && paymentData.card) {
      const infoCardCrypted = {
        // criptografa os dados do cartão com a função encrypt
        encryptedData: encrypt(paymentData.card.encryptedData),
      };
      // adiciona os dados criptografados ao pagamento
      payment.setCard(infoCardCrypted);
    }
    // cria o pagamento
    const created = await this.paymentRepository.create(payment);

    return created;
  }
}
