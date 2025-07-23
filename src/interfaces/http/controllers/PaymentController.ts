import { FastifyRequest, FastifyReply } from "fastify";
import {
  SchemaCreatePayment,
  SchemaFindPaymentById,
  SchemaStatusPayment,
} from "../../../shared/schemasValidations/PaymentSchemas";
import z from "zod";
import MySQLPaymentRepository from "../../../infrastructure/db/mysql/MySQLPaymentRepository";
import CreatePayment from "../../../application/use-cases/CreatePayment";
import { FindPaymentById } from "../../../application/use-cases/FindPaymentById";
import ModifyStatusPayment from "../../../application/use-cases/ModifyStatusPayment";

export default class PaymentController {
  async healthCheck(reply: FastifyReply) {
    return reply.status(200).send({ status: "OK" });
  }
  async create(request: FastifyRequest, reply: FastifyReply) {
    const validation = SchemaCreatePayment.safeParse(request.body);
    if (!validation.success) {
      return reply.status(400).send({
        error: "Dados inválidos!",
        issues: validation.error.issues,
      });
    }
    const data = request.body as z.infer<typeof SchemaCreatePayment>;

    const mysqlPayment = new MySQLPaymentRepository();
    const createPaymentUseCase = new CreatePayment(mysqlPayment);

    const created = await createPaymentUseCase.execute(data);
    if (!created) {
      return reply.status(400).send({ error: "Falha ao criar o pagamento" });
    }
    return reply.status(201).send(created);
  }
  async findPaymentById(request: FastifyRequest, reply: FastifyReply) {
    const validation = SchemaFindPaymentById.safeParse(request.params);
    if (!validation.success) {
      return reply
        .status(400)
        .send({ error: "Invalid ID format", issues: validation.error.issues });
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
  async modifyStatusPayment(request: FastifyRequest, reply: FastifyReply) {
    const idValidation = SchemaFindPaymentById.safeParse(request.params);
    const statusValidation = SchemaStatusPayment.safeParse(request.body);
    if (!idValidation.success || !statusValidation.success) {
      return reply.status(400).send({
        error: "Invalid ID format",
        issues: [
          ...(idValidation.error?.issues ?? []),
          ...(statusValidation.error?.issues ?? []),
        ],
      });
    }
    const { id } = idValidation.data as z.infer<typeof SchemaFindPaymentById>;
    const { status } = statusValidation.data as z.infer<
      typeof SchemaStatusPayment
    >;

    const mysqlPayment = new MySQLPaymentRepository();
    const findPaymentByIdUseCase = new FindPaymentById(mysqlPayment);
    const payment = await findPaymentByIdUseCase.execute(id);
    if (!payment) {
      return reply.status(404).send({ error: "Pagamento não encontrado" });
    }
    const modifyStatusPaymentUseCase = new ModifyStatusPayment(mysqlPayment);
    const updatedPaymentStatus = await modifyStatusPaymentUseCase.execute(
      id,
      status
    );

    if (!updatedPaymentStatus) {
      return reply.status(404).send({ error: "Pagamento nao encontrado" });
    }

    return reply.status(200).send(updatedPaymentStatus);
  }
}
