import { FastifyRequest, FastifyReply } from "fastify";
import {
  SchemaFindRefundById,
  SchemaFullRefund,
  SchemaModifyRefundStatus,
  SchemaPartialRefund,
} from "../../../shared/schemasValidations/RefundSchemas";
import z from "zod";
import MySQLPaymentRepository from "../../../infrastructure/db/mysql/MySQLPaymentRepository";
import { FindPaymentById } from "../../../application/use-cases/FindPaymentById";
import Refund from "../../../domain/entities/Refund";
import MySQLRefundRepository from "../../../infrastructure/db/mysql/MySQLRefundRepository";
import CreateRefund from "../../../application/use-cases/CreateRefund";
import FindRefundById from "../../../application/use-cases/FindRefundById";

export default class RefundController {
  async partialRefund(request: FastifyRequest, reply: FastifyReply) {
    // Validando os dados
    const validation = SchemaPartialRefund.safeParse(request.body);
    // Se os dados forem inválidos
    if (!validation.success) {
      return reply.status(400).send({
        error: "Dados inválidos!",
        issues: validation.error.issues,
      });
    }
    const data = request.body as z.infer<typeof SchemaPartialRefund>;
    const mysqlPayment = new MySQLPaymentRepository();
    const findPaymentByIdUseCase = new FindPaymentById(mysqlPayment);
    const payment = await findPaymentByIdUseCase.execute(data.paymentId);
    // Verifica se o pagamento foi encontrado, caso contrario retorna 404 e o fluxo para por aqui
    if (!payment) {
      return reply.status(404).send({ error: "Pagamento não encontrado" });
    }
    // Verifica se o valor do reembolso é maior que o valor do pagamento, pois não é possivel realizar um reembolso maior que o valor do pagamento
    if (payment.getAmount() < data.amount) {
      return reply
        .status(400)
        .send({ error: "Valor do reembolso é maior que o valor do pagamento" });
    }
    // Para realizar um reembolso parcial o pagamento precisa estar concluido

    if (payment.getStatus() !== "completed") {
      return reply.status(400).send({
        error:
          "Pagamento não está concluido, não é possível realizar reembolso parcial",
      });
    }
    const refund = new Refund({
      paymentId: data.paymentId,
      amount: data.amount,
      type: "partial",
    });
    const mysqlRefund = new MySQLRefundRepository();
    const createRefundUseCase = new CreateRefund(mysqlRefund);

    const created = await createRefundUseCase.execute(refund);
    // Se o reembolso nao for criado
    if (!created) {
      return reply.status(400).send({ error: "Falha ao criar o reembolso" });
    }
    // O reembolso foi criado com sucesso e retorna o status 201 junto com o reembolso
    return reply.status(201).send(created);
  }
  async fullRefund(request: FastifyRequest, reply: FastifyReply) {
    // Validando os dados
    const validation = SchemaFullRefund.safeParse(request.body);
    if (!validation.success) {
      return reply.status(400).send({
        error: "Dados inválidos!",
        issues: validation.error.issues,
      });
    }
    const data = request.body as z.infer<typeof SchemaFullRefund>;
    const mysqlPayment = new MySQLPaymentRepository();
    const findPaymentByIdUseCase = new FindPaymentById(mysqlPayment);
    const payment = await findPaymentByIdUseCase.execute(data.paymentId);
    // Verifica se o pagamento foi encontrado caso contrario retorna 404 e o fluxo para por aqui
    if (!payment) {
      return reply.status(404).send({ error: "Pagamento não encontrado" });
    }
    // O tipo do reembolso já está sendo definido como full
    const refund = new Refund({
      paymentId: data.paymentId,
      amount: payment.getAmount(),
      type: "full",
    });
    // Para realizar um reembolso total o pagamento precisa estar concluido
    if (payment.getStatus() !== "completed") {
      return reply.status(400).send({
        error:
          "Pagamento não está concluido, não é possível realizar reembolso total",
      });
    }
    const mysqlRefund = new MySQLRefundRepository();
    const createRefundUseCase = new CreateRefund(mysqlRefund);
    const created = await createRefundUseCase.execute(refund);
    // Se o reembolso nao for criado
    if (!created) {
      return reply.status(400).send({ error: "Falha ao criar o reembolso" });
    }
    // O reembolso foi criado com sucesso e retorna o status 201 junto com o reembolso
    return reply.status(201).send(created);
  }
  async findRefundById(request: FastifyRequest, reply: FastifyReply) {
    // Validando os dados
    const validation = SchemaFindRefundById.safeParse(request.params);
    // Se os dados forem inválidos
    if (!validation.success) {
      reply.status(400).send({
        error: "Dados inválidos!",
        issues: validation.error.issues,
      });
      return;
    }
    const data = request.params as z.infer<typeof SchemaFindRefundById>;
    const mysqlRefund = new MySQLRefundRepository();
    const findRefundByIdUseCase = new FindRefundById(mysqlRefund);
    const refund = await findRefundByIdUseCase.execute(data.id);
    // Se o reembolso nao for encontrado
    if (!refund) {
      return reply.status(404).send({ error: "Reembolso não encontrado" });
    }
    // O reembolso foi encontrado e retorna o status 200 junto com o reembolso
    return reply.status(200).send(refund);
  }
  async modifyRefundStatus(request: FastifyRequest, reply: FastifyReply) {
    const idValidation = SchemaFindRefundById.safeParse(request.params);
    const statusValidation = SchemaModifyRefundStatus.safeParse(request.body);

    if (!idValidation.success || !statusValidation.success) {
      return reply.status(400).send({
        error: "Dados inválidos!",
        issues: [
          ...(idValidation.error?.issues ?? []),
          ...(statusValidation.error?.issues ?? []),
        ],
      });
    }
    const { id } = idValidation.data as z.infer<typeof SchemaFindRefundById>;
    const { status } = statusValidation.data as z.infer<
      typeof SchemaModifyRefundStatus
    >;
    const mysqlRefund = new MySQLRefundRepository();
    const findRefundByIdUseCase = new FindRefundById(mysqlRefund);
    const refund = await findRefundByIdUseCase.execute(id);
    // Verificando se o reembolso foi encontrado
    if (!refund) {
      return reply.status(404).send({ error: "Reembolso não encontrado" });
    }
    const modified = await mysqlRefund.modifyStatus(id, status);
    // Verificando se o reembolso foi modificado
    if (!modified) {
      return reply
        .status(400)
        .send({ error: "Falha ao modificar o status do reembolso" });
    }
    // O reembolso foi modificado com sucesso e retorna o status 200 junto com o reembolso
    return reply.status(200).send(modified);
  }
}
