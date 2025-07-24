import Refund from "../../domain/entities/Refund";
import RefundRepository from "../../domain/repositories/RefundRepository";

export default class CreateRefund {
  // O constructor recebe o repositório de reembolsos como argumento
  constructor(private refundRepository: RefundRepository) {
    this.refundRepository = refundRepository;
  }

  // o execute recebe os dados do reembolso como argumento e cria o reembolso
  async execute(refund: Refund): Promise<Refund | null> {
    return await this.refundRepository.create(refund);
  }
}
