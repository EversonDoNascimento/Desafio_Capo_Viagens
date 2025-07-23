export type PaymentProps = {
  id?: number;
  amount: number;
  method: string;
  card?: {
    encryptedData: string;
  };
  buyer: {
    name: string;
    email: string;
  };
  status?: "pending" | "completed" | "failed";
  paymentDate?: Date;
};

export default class Payment {
  private id?: number;
  private amount: number;
  private method: string;
  private status: "pending" | "completed" | "failed" = "pending";
  private card?: {
    encryptedData: string;
  };
  private buyer: {
    name: string;
    email: string;
  };
  private paymentDate?: Date;
  constructor({
    id,
    amount,
    method,
    card,
    buyer,
    status,
    paymentDate,
  }: PaymentProps) {
    if (id) {
      this.id = id;
    }
    if (status) {
      this.status = status;
    }
    if (amount <= 0) throw new Error("Amount must be greater than zero.");
    if (!["credit_card", "pix"].includes(method)) {
      throw new Error("Invalid payment method.");
    }
    this.amount = amount;
    this.method = method;
    this.card = card;
    this.buyer = buyer;
    this.paymentDate = paymentDate;
  }

  getId() {
    return this.id;
  }
  setId(id: number) {
    this.id = id;
  }
  getAmount() {
    return this.amount;
  }
  setAmount(amount: number) {
    this.amount = amount;
  }
  getMethod() {
    return this.method;
  }
  setMethod(method: string) {
    this.method = method;
  }
  getCard() {
    return this.card;
  }
  setCard(card: { encryptedData: string }) {
    this.card = card;
  }
  getBuyer() {
    return this.buyer;
  }
  setBuyer(buyer: { name: string; email: string }) {
    this.buyer = buyer;
  }
  getEncryptedCardIfApplicable(): string | null {
    if (this.method === "credit_card" && this.card?.encryptedData) {
      return this.card.encryptedData;
    }
    return null;
  }
  getStatus() {
    return this.status;
  }
  setStatus(status: "pending" | "completed" | "failed") {
    this.status = status;
  }
  getPaymentDate() {
    return this.paymentDate;
  }
  setPaymentDate(paymentDate: Date) {
    this.paymentDate = paymentDate;
  }
}
