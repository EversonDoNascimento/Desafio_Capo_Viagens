import RefundRepository from "../../domain/repositories/RefundRepository";

export default class ModifyStatusRefund {
  constructor(private refundRepository: RefundRepository) {
    this.refundRepository = refundRepository;
  }
  async execute(refundId: number, status: "pending" | "completed" | "failed") {
    // Apenas o ID do reembolso e o status são necessários para modificar o status
    // O status pode ser 'pending', 'completed' ou 'failed'
    return await this.refundRepository.modifyStatus(refundId, status);
  }
}
