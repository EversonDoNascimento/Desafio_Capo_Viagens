import { FastifyInstance } from "fastify";
import RefundController from "../controllers/RefundController";
import {
  createFullRefundSchema,
  createPartialRefundSchema,
  getRefundByIDSchema,
  modifyStatusRefundSchema,
} from "../schemas/refundSchemas";

export default function refundRoutes(server: FastifyInstance) {
  // Instanciando o controller
  const refundController = new RefundController();
  // Definindo as rotas
  // Rota para criar um reembolso parcial
  server.post(
    "/payments/refund-partial",
    { schema: createPartialRefundSchema },
    (request, reply) => refundController.partialRefund(request, reply)
  );
  // Rota para criar um reembolso total
  server.post(
    "/payments/refund",
    { schema: createFullRefundSchema },
    (request, reply) => refundController.fullRefund(request, reply)
  );
  // Rota para buscar um reembolso por ID
  server.get("/refund/:id", { schema: getRefundByIDSchema }, (request, reply) =>
    refundController.findRefundById(request, reply)
  );
  // Rota para modificar o status de um reembolso
  // Foi utilizado o verbo PATCH pois apenas o status pode ser modificado
  server.patch(
    "/refund/status/:id",
    { schema: modifyStatusRefundSchema },
    (request, reply) => refundController.modifyRefundStatus(request, reply)
  );
}
