import { FastifyInstance } from "fastify";
import RefundController from "../controllers/RefundController";
import {
  createFullRefundSchema,
  createPartialRefundSchema,
  getRefundByIDSchema,
  modifyStatusRefundSchema,
} from "../schemas/refundSchemas";

export default function refundRoutes(server: FastifyInstance) {
  const refundController = new RefundController();

  server.post(
    "/payments/refund-partial",
    { schema: createPartialRefundSchema },
    (request, reply) => refundController.partialRefund(request, reply)
  );
  server.post(
    "/payments/refund",
    { schema: createFullRefundSchema },
    (request, reply) => refundController.fullRefund(request, reply)
  );
  server.get("/refund/:id", { schema: getRefundByIDSchema }, (request, reply) =>
    refundController.findRefundById(request, reply)
  );
  server.patch(
    "/refund/status/:id",
    { schema: modifyStatusRefundSchema },
    (request, reply) => refundController.modifyRefundStatus(request, reply)
  );
}
