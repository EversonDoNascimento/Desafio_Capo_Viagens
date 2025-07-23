import Refund from "../entities/Refund";

export default abstract class RefundRepository {
  abstract create(refund: Refund): Promise<Refund | null>;
  abstract findById(id: number): Promise<Refund | null>;
  abstract modifyStatus(
    id: number,
    status: "pending" | "completed" | "failed"
  ): Promise<Refund | null>;
}
