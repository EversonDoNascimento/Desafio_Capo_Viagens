// Criando o type PaymentProps
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

// Criando a classe Payment
export default class Payment {
  // O ID pode ser opcional, pois quando passarmos os dados para o banco de dados, ele vai ser gerado automaticamente
  private id?: number;
  private amount: number;
  private method: string;
  // O status pode ser pending, completed ou failed
  private status: "pending" | "completed" | "failed" = "pending";
  // O card pode ser opcional, pois nem todos os pagamentos seram feitos com cartão
  private card?: {
    encryptedData: string;
  };
  private buyer: {
    name: string;
    email: string;
  };
  // O paymentDate pode ser opcional, pois a data será gerada automaticamente pelo banco de dados
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
    // Verifica se o status existe, pois no momento que o pagamento é passado da rota para o controller, ele vem como undefined
    if (status) {
      this.status = status;
    }
    // Verifica se o valor do pagamento é maior que zero
    if (amount <= 0) throw new Error("Amount must be greater than zero.");
    // Reforçando a validação do payment method
    if (!["credit_card", "pix"].includes(method)) {
      throw new Error("Invalid payment method.");
    }
    this.amount = amount;
    this.method = method;
    this.card = card;
    this.buyer = buyer;
    this.paymentDate = paymentDate;
  }

  // Getters e Setters
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
  // O método getEncryptedCardIfApplicable retorna o encryptedData do cartão, se o pagamento for feito com cartão
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
