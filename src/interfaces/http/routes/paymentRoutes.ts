import { FastifyInstance } from "fastify";
import PaymentController from "../controllers/PaymentController";

export default async function paymentRoutes(server: FastifyInstance) {
  const paymentController = new PaymentController();

  server.get("/health", () => paymentController.healthCheck());
  server.post("/payments", (request, reply) =>
    paymentController.create(request, reply)
  );
  server.get("/payments/:id", async (request, reply) =>
    paymentController.findPaymentById(request, reply)
  );
  server.patch("/payments/status/:id", (request, reply) =>
    paymentController.modifyStatusPayment(request, reply)
  );
}
