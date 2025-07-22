import RefundRepository from "../../domain/repositories/RefundRepository";

export default class ModifyStatusRefund {
  constructor(private refundRepository: RefundRepository) {
    this.refundRepository = refundRepository;
  }
  async execute(refundId: number, status: "pending" | "completed" | "failed") {
    return await this.refundRepository.modifyStatus(refundId, status);
  }
}
