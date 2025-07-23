import Refund from "../../domain/entities/Refund";
import RefundRepository from "../../domain/repositories/RefundRepository";

export default class CreateRefund {
  constructor(private refundRepository: RefundRepository) {
    this.refundRepository = refundRepository;
  }

  async execute(refund: Refund): Promise<Refund | null> {
    return await this.refundRepository.create(refund);
  }
}
