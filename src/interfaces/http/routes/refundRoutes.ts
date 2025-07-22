import { FastifyInstance } from "fastify";
import RefundController from "../controllers/RefundController";

export default async function refundRoutes(server: FastifyInstance) {
  const refundController = new RefundController();

  server.post("/payments/refund-partial", (request, reply) =>
    refundController.partialRefund(request, reply)
  );
  server.post("/payments/refund", async (request, reply) =>
    refundController.fullRefund(request, reply)
  );
  server.get("/refund/:id", (request, reply) =>
    refundController.findRefundById(request, reply)
  );
  server.patch("/refund/status/:id", (request, reply) =>
    refundController.modifyRefundStatus(request, reply)
  );
}
