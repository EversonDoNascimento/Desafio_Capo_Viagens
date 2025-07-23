export const swaggerConfig = {
  openapi: {
    info: {
      title: "Payment and Refund API",
      description: "API for handling payments and refunds",
      version: "1.0.0",
    },
    servers: [
      {
        url: `http://localhost:${process.env.SERVER_PORT || "3000"}`,
      },
    ],
  },
};
