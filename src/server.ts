import fastify from "fastify";
import dotenv from "dotenv";
import paymentRoutes from "./interfaces/http/routes/paymentRoutes";
dotenv.config();

const server = fastify({
  logger: true,
});

server.register(paymentRoutes);

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
