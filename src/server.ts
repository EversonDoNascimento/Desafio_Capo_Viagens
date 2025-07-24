import fastify from "fastify";
import dotenv from "dotenv";
import paymentRoutes from "./interfaces/http/routes/paymentRoutes";
import refundRoutes from "./interfaces/http/routes/refundRoutes";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { swaggerConfig } from "./interfaces/http/swagger";

// iniciando as variáveis de ambiente
dotenv.config();

// criando o servidor
const server = fastify({
  logger: true,
});

// registrando as rotas e configurando o swagger
server.register(swagger, swaggerConfig);
server.register(swaggerUi, {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "full",
    deepLinking: false,
  },
  staticCSP: true,
  transformStaticCSP: (header) => header.replace("unsafe-inline", ""),
});
server.register(paymentRoutes);
server.register(refundRoutes);

// iniciando o servidor
server.listen(
  // o host 0.0.0.0 faz com que o servidor seja acessivel de qualquer ip
  { port: parseInt(process.env.SERVER_PORT || "3000"), host: "0.0.0.0" },
  (err, address) => {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }
    server.log.info(`Server listening at ${address}`);
  }
);

export default server;
