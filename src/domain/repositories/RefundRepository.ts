import Refund from "../entities/Refund";

// Classe abstrata RefundRepository
export default abstract class RefundRepository {
  // Método para criar um novo reembolso
  abstract create(refund: Refund): Promise<Refund | null>;
  // Método para buscar um reembolso pelo ID
  abstract findById(id: number): Promise<Refund | null>;
  // Método para modificar o status de um reembolso
  abstract modifyStatus(
    id: number,
    status: "pending" | "completed" | "failed"
  ): Promise<Refund | null>;
}
