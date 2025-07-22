type RefundProps = {
  id?: number;
  paymentId: number;
  amount: number;
  status?: "pending" | "completed" | "failed";
  type: "partial" | "full";
  refundDate?: Date;
};

export default class Refund {
  private id?: number;
  private paymentId: number;
  private amount: number;
  private status: "pending" | "completed" | "failed";
  private type: "partial" | "full";
  private refundDate: Date;

  constructor({
    id,
    paymentId,
    amount,
    status = "pending",
    refundDate = new Date(),
    type,
  }: RefundProps) {
    if (amount <= 0) throw new Error("Amount must be greater than zero.");
    this.id = id;
    this.paymentId = paymentId;
    this.amount = amount;
    this.status = status;
    this.type = type;
    this.refundDate = refundDate;
  }

  getId() {
    return this.id;
  }

  getPaymentId() {
    return this.paymentId;
  }

  getAmount() {
    return this.amount;
  }

  getStatus() {
    return this.status;
  }

  getRefundDate() {
    return this.refundDate;
  }

  setId(id: number) {
    this.id = id;
  }

  setPaymentId(paymentId: number) {
    this.paymentId = paymentId;
  }

  setAmount(amount: number) {
    if (amount <= 0) throw new Error("Amount must be greater than zero.");
    this.amount = amount;
  }

  setStatus(status: "pending" | "completed" | "failed") {
    this.status = status;
  }

  setRefundDate(refundDate: Date) {
    this.refundDate = refundDate;
  }
  getType() {
    return this.type;
  }

  setType(type: "partial" | "full") {
    this.type = type;
  }
}
