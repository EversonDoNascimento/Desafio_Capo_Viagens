import z from "zod";
import { SchemaCreatePayment } from "../../shared/schemasValidations/PaymentSchemas";

type PaymentType = z.infer<typeof SchemaCreatePayment>;
type PaymentTypeWithId = PaymentType & { id?: string };

export default class Payment {
  id?: string;
  amount: number;
  method: string;
  card?: {
    number: string;
  };
  buyer: {
    name: string;
    email: string;
  };
  constructor({ id, amount, method, card, buyer }: PaymentTypeWithId) {
    if (!id) {
      this.id = id;
    }
    this.amount = amount;
    this.method = method;
    this.card = card;
    this.buyer = buyer;
  }
}
