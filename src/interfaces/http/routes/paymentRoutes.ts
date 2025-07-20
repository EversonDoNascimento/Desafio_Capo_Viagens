import { FastifyInstance } from "fastify";
import PaymentController from "../controllers/PaymentController";

export default async function paymentRoutes(server: FastifyInstance) {
  const paymentController = new PaymentController();

  server.get("/health", () => paymentController.healthCheck());
  server.post("/payments", (request, reply) =>
    paymentController.create(request, reply)
  );
}
