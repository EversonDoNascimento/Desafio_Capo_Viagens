import { FastifyInstance } from "fastify";
import PaymentController from "../controllers/PaymentController";
import {
  createPaymentSchema,
  getPaymentByIDSchema,
  healthCheckSchema,
  modifyStatusPaymentSchema,
} from "../schemas/paymentSchemas";

export default function paymentRoutes(server: FastifyInstance) {
  // Instanciando o controller
  const paymentController = new PaymentController();
  // Definindo as rotas
  // Rota para health check
  server.get("/health", { schema: healthCheckSchema }, (_, reply) =>
    paymentController.healthCheck(reply)
  );
  // Rota para criar um pagamento
  server.post("/payments", { schema: createPaymentSchema }, (request, reply) =>
    paymentController.create(request, reply)
  );
  // Rota para buscar um pagamento por ID
  server.get(
    "/payments/:id",
    { schema: getPaymentByIDSchema },
    (request, reply) => paymentController.findPaymentById(request, reply)
  );
  // Rota para modificar o status de um pagamento
  // Foi utilizado o verbo PATCH pois apenas o status pode ser modificado
  server.patch(
    "/payments/status/:id",
    { schema: modifyStatusPaymentSchema },
    (request, reply) => paymentController.modifyStatusPayment(request, reply)
  );
}
