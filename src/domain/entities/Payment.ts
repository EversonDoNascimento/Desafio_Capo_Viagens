export type PaymentProps = {
  id?: string;
  amount: number;
  method: string;
  card?: {
    encryptedData: string;
  };
  buyer: {
    name: string;
    email: string;
  };
};

export default class Payment {
  private id?: string;
  private amount: number;
  private method: string;
  private card?: {
    encryptedData: string;
  };
  private buyer: {
    name: string;
    email: string;
  };
  constructor({ id, amount, method, card, buyer }: PaymentProps) {
    if (id) {
      this.id = id;
    }
    if (amount <= 0) throw new Error("Amount must be greater than zero.");
    if (!["credit_card", "pix"].includes(method)) {
      throw new Error("Invalid payment method.");
    }
    this.amount = amount;
    this.method = method;
    this.card = card;
    this.buyer = buyer;
  }

  getId() {
    return this.id;
  }
  setId(id: string) {
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
}
