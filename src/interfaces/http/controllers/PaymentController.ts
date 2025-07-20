import { FastifyRequest, FastifyReply } from "fastify";
import { SchemaCreatePayment } from "../../../shared/schemasValidations/PaymentSchemas";
import z from "zod";

export default class PaymentController {
  async healthCheck() {
    return { message: "ok" };
  }
  async create(request: FastifyRequest, reply: FastifyReply) {
    const validation = SchemaCreatePayment.safeParse(request.body);
    if (!validation.success) {
      reply.status(400).send({
        error: "Dados inválidos!",
        issues: validation.error.issues,
      });
      return;
    }
    const { method, amount, card, buyer } = request.body as z.infer<
      typeof SchemaCreatePayment
    >;
    return { message: "Payment processed successfully" };
  }
}
