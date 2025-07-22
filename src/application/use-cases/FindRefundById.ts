import Refund from "../../domain/entities/Refund";
import RefundRepository from "../../domain/repositories/RefundRepository";

export default class FindRefundById {
  constructor(private refundRepository: RefundRepository) {
    this.refundRepository = refundRepository;
  }
  async execute(refundId: number): Promise<Refund | null> {
    return await this.refundRepository.findById(refundId);
  }
}
