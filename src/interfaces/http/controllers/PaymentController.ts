import { FastifyRequest, FastifyReply } from "fastify";
import {
  SchemaCreatePayment,
  SchemaFindPaymentById,
} from "../../../shared/schemasValidations/PaymentSchemas";
import z from "zod";
import MySQLPaymentRepository from "../../../infrastructure/db/mysql/MySQLPaymentRepository";
import CreatePayment from "../../../application/use-cases/CreatePayment";
import { FindPaymentById } from "../../../application/use-cases/FindPaymentById";

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
    const data = request.body as z.infer<typeof SchemaCreatePayment>;

    const mysqlPayment = new MySQLPaymentRepository();
    const createPaymentUseCase = new CreatePayment(mysqlPayment);

    const created = await createPaymentUseCase.execute(data);
    if (!created.success) {
      return reply.status(400).send({ error: "Falha ao criar o pagamento" });
    }
    return reply.status(201).send({
      message: "Pagamento criado com sucesso!",
      id: created.id,
    });
  }
  async findPaymentById(request: FastifyRequest, reply: FastifyReply) {
    const validation = SchemaFindPaymentById.safeParse(request.params);
    if (!validation.success) {
      reply
        .status(400)
        .send({ error: "Invalid ID format", issues: validation.error.issues });
      return;
    }

    const data = request.params as z.infer<typeof SchemaFindPaymentById>;
    const mysqlPayment = new MySQLPaymentRepository();
    const findPaymentByIdUseCase = new FindPaymentById(mysqlPayment);
    const result = await findPaymentByIdUseCase.execute(data.id);
    if (!result) {
      return reply.status(404).send({ error: "Pagamento não encontrado" });
    }

    return reply.status(200).send(result);
  }
}
