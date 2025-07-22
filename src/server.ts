import fastify from "fastify";
import dotenv from "dotenv";
import paymentRoutes from "./interfaces/http/routes/paymentRoutes";
import refundRoutes from "./interfaces/http/routes/refundRoutes";
dotenv.config();

const server = fastify({
  logger: true,
});

server.register(paymentRoutes);
server.register(refundRoutes);
server.listen(
  { port: parseInt(process.env.SERVER_PORT || "3000") },
  (err, address) => {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }
    server.log.info(`Server listening at ${address}`);
  }
);

export default server;
