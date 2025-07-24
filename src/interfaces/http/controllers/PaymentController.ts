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
    // Validando os dados
    const validation = SchemaCreatePayment.safeParse(request.body);
    // Se os dados forem inválidos
    if (!validation.success) {
      return reply.status(400).send({
        error: "Dados inválidos!",
        issues: validation.error.issues,
      });
    }
    const data = request.body as z.infer<typeof SchemaCreatePayment>;
    // Instanciando o repositório
    const mysqlPayment = new MySQLPaymentRepository();
    // Inserindo o repositório via injeção de dependência
    const createPaymentUseCase = new CreatePayment(mysqlPayment);
    // Criando o pagamento atraves do use case
    const created = await createPaymentUseCase.execute(data);
    // Se o pagamento não for criado
    if (!created) {
      return reply.status(400).send({ error: "Falha ao criar o pagamento" });
    }
    // O pagamento foi criado com sucesso e retorna o status 201 junto com o pagamento
    return reply.status(201).send(created);
  }
  async findPaymentById(request: FastifyRequest, reply: FastifyReply) {
    // Validando os dados
    const validation = SchemaFindPaymentById.safeParse(request.params);
    // Se os dados forem inválidos
    if (!validation.success) {
      return reply
        .status(400)
        .send({ error: "Invalid ID format", issues: validation.error.issues });
    }

    const data = request.params as z.infer<typeof SchemaFindPaymentById>;
    const mysqlPayment = new MySQLPaymentRepository();
    // Inserindo o repositório via injeção de dependência
    const findPaymentByIdUseCase = new FindPaymentById(mysqlPayment);
    // Buscando um pagamento por ID atraves do use case
    const result = await findPaymentByIdUseCase.execute(data.id);
    // Se o pagamento não for encontrado
    if (!result) {
      return reply.status(404).send({ error: "Pagamento não encontrado" });
    }
    // O pagamento foi encontrado e retorna o status 200 junto com o pagamento
    return reply.status(200).send(result);
  }
  async modifyStatusPayment(request: FastifyRequest, reply: FastifyReply) {
    // Validando o ID do pagamento que foi passado via params
    const idValidation = SchemaFindPaymentById.safeParse(request.params);
    // Validando o status do pagamento que foi passado via body
    // O status só pode ser 'pending', 'completed' ou 'failed'
    const statusValidation = SchemaStatusPayment.safeParse(request.body);
    // Se os dados forem inválidos
    if (!idValidation.success || !statusValidation.success) {
      return reply.status(400).send({
        error: "Invalid ID format",
        issues: [
          ...(idValidation.error?.issues ?? []),
          ...(statusValidation.error?.issues ?? []),
        ],
      });
    }
    // Criando variáveis com os dados validados
    const { id } = idValidation.data as z.infer<typeof SchemaFindPaymentById>;
    const { status } = statusValidation.data as z.infer<
      typeof SchemaStatusPayment
    >;

    const mysqlPayment = new MySQLPaymentRepository();
    // O caso de uso findPaymentById está sendo chamado pois precisamos verificar se o pagamento existe
    const findPaymentByIdUseCase = new FindPaymentById(mysqlPayment);
    const payment = await findPaymentByIdUseCase.execute(id);
    // Realizando verificação se o pagamento foi encontrado, caso não tenha sido encontrado retorna 404 e o fluxo para por aqui
    if (!payment) {
      return reply.status(404).send({ error: "Pagamento não encontrado" });
    }
    // Após a verificação da existência do pagamento, o caso de uso modifyStatusPayment é chamado
    const modifyStatusPaymentUseCase = new ModifyStatusPayment(mysqlPayment);
    // Os dados passados já estão validados, então podemos passar diretamente para o use case
    const updatedPaymentStatus = await modifyStatusPaymentUseCase.execute(
      id,
      status
    );
    // Realizando verificação se o pagamento foi modificado, caso nao tenha sido modificado retorna 400
    if (!updatedPaymentStatus) {
      return reply.status(400).send({ error: "Falha ao modificar o status" });
    }
    // O pagamento foi modificado com sucesso e retorna o status 200 junto com o pagamento já com o status atualizado
    return reply.status(200).send(updatedPaymentStatus);
  }
}
