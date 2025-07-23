import { FastifyInstance } from "fastify";
import PaymentController from "../controllers/PaymentController";
import {
  createPaymentSchema,
  getPaymentByIDSchema,
  healthCheckSchema,
  modifyStatusPaymentSchema,
} from "../schemas/paymentSchemas";

export default function paymentRoutes(server: FastifyInstance) {
  const paymentController = new PaymentController();

  server.get("/health", { schema: healthCheckSchema }, (_, reply) =>
    paymentController.healthCheck(reply)
  );
  server.post("/payments", { schema: createPaymentSchema }, (request, reply) =>
    paymentController.create(request, reply)
  );
  server.get(
    "/payments/:id",
    { schema: getPaymentByIDSchema },
    (request, reply) => paymentController.findPaymentById(request, reply)
  );
  server.patch(
    "/payments/status/:id",
    { schema: modifyStatusPaymentSchema },
    (request, reply) => paymentController.modifyStatusPayment(request, reply)
  );
}
