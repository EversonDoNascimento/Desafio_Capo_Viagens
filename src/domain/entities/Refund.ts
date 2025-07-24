// Criando o type RefundProps
type RefundProps = {
  id?: number;
  paymentId: number;
  amount: number;
  status?: "pending" | "completed" | "failed";
  type: "partial" | "full";
  refundDate?: Date;
};

// Criando a classe Refund
export default class Refund {
  // O ID será opcional, pois ele vem do banco de dados
  private id?: number;
  private paymentId: number;
  private amount: number;
  private status: "pending" | "completed" | "failed";
  // Um reembolso pode ser parcial ou completo
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
    // Se o reembolso for parcial, o amount deve ser maior que zero
    if (amount <= 0) throw new Error("Amount must be greater than zero.");
    this.id = id;
    this.paymentId = paymentId;
    this.amount = amount;
    this.status = status;
    this.type = type;
    this.refundDate = refundDate;
  }

  // Getters e Setters
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
