import fastify from "fastify";
import paymentRoutes from "../../interfaces/http/routes/paymentRoutes";
import refundRoutes from "../../interfaces/http/routes/refundRoutes";

const buildApp = () => {
  const app = fastify({
    logger: true,
  });
  app.register(paymentRoutes);
  app.register(refundRoutes);

  return app;
};

export default buildApp;
