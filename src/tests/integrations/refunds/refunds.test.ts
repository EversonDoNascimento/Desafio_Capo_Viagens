import request from "supertest";
import buildApp from "../app";
import pool from "../../../infrastructure/db/connection";

let app: ReturnType<typeof buildApp>;

beforeAll(async () => {
  app = buildApp();
  await app.ready();
});

afterAll(async () => {
  await app.close();
  await pool.end();
});

describe("Testes nas rotas de reembolso", () => {
  describe("Criar Reembolso Total", () => {
    it("Deve criar um novo reembolso total", async () => {
      const response = await request(app.server).post("/payments/refund").send({
        paymentId: 1,
      });

      expect(response.statusCode).toBe(201);
    });

    it("Deve retornar erro ao criar reembolso com paymentId negativo", async () => {
      const response = await request(app.server).post("/payments/refund").send({
        paymentId: -1,
      });

      expect(response.statusCode).toBe(400);
    });

    it("Deve retornar erro ao criar reembolso com paymentId que não existe", async () => {
      const response = await request(app.server).post("/payments/refund").send({
        paymentId: 99999,
      });

      expect(response.statusCode).toBe(404);
    });
    it("Deve retornar erro ao criar um reembolso de um pagamento com o status pendente ", async () => {
      const createPayment = await request(app.server)
        .post("/payments")
        .send({
          amount: 100,
          method: "pix",
          buyer: {
            name: "João",
            email: "joao@email.com",
          },
        });
      const response = await request(app.server).post("/payments/refund").send({
        paymentId: createPayment.body.id,
      });
      expect(response.statusCode).toBe(400);
    });
  });

  describe("Criar Reembolso Parcial", () => {
    it("Deve criar um novo reembolso parcial", async () => {
      const response = await request(app.server)
        .post("/payments/refund-partial")
        .send({
          paymentId: 1,
          amount: 50,
        });

      expect(response.statusCode).toBe(201);
    });

    it("Deve retornar erro ao criar reembolso com paymentId negativo", async () => {
      const response = await request(app.server)
        .post("/payments/refund-partial")
        .send({
          paymentId: -1,
          amount: 50,
        });

      expect(response.statusCode).toBe(400);
    });

    it("Deve retornar erro ao criar reembolso com paymentId que não existe", async () => {
      const response = await request(app.server)
        .post("/payments/refund-partial")
        .send({
          paymentId: 99999,
          amount: 50,
        });

      expect(response.statusCode).toBe(404);
    });
    it("Deve retornar erro ao criar reembolso parcial com valor negativo", async () => {
      const response = await request(app.server)
        .post("/payments/refund-partial")
        .send({
          paymentId: 1,
          amount: -50,
        });

      expect(response.statusCode).toBe(400);
    });
    it("Deve retornar erro ao criar reembolso parcial com valor zero", async () => {
      const response = await request(app.server)
        .post("/payments/refund-partial")
        .send({
          paymentId: 1,
          amount: 0,
        });

      expect(response.statusCode).toBe(400);
    });
    it("Deve retornar erro ao criar um reembolso de um pagamento com o status pendente ", async () => {
      const createPayment = await request(app.server)
        .post("/payments")
        .send({
          amount: 100,
          method: "pix",
          buyer: {
            name: "João",
            email: "joao@email.com",
          },
        });
      const response = await request(app.server)
        .post("/payments/refund-partial")
        .send({
          paymentId: createPayment.body.id,
          amount: 50,
        });
      expect(response.statusCode).toBe(400);
    });
    it("Deve retornar erro ao criar reembolso parcial com valor maior que o valor do pagamento", async () => {
      const response = await request(app.server)
        .post("/payments/refund-partial")
        .send({
          paymentId: 1,
          amount: 999999,
        });

      expect(response.statusCode).toBe(400);
    });
  });

  describe("Buscar Reembolso por ID", () => {
    it("Deve buscar um reembolso existente por ID", async () => {
      const response = await request(app.server).get("/refund/1");

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("id");
      expect(response.body.id).toBe(1);
    });

    it("Deve retornar erro ao buscar reembolso com ID inválido", async () => {
      const response = await request(app.server).get("/refund/99999");

      expect(response.statusCode).toBe(404);
    });
    it("Deve retornar erro ao buscar reembolso com ID não numérico", async () => {
      const response = await request(app.server).get("/refund/abc");

      expect(response.statusCode).toBe(400);
    });
    it("Deve retornar erro ao buscar reembolso com o ID negativo", async () => {
      const response = await request(app.server).get("/refund/-1");

      expect(response.statusCode).toBe(400);
    });
  });
  describe("Alterar Status do Reembolso", () => {
    it("Deve alterar o status do reembolso", async () => {
      const response = await request(app.server)
        .patch("/refund/status/1")
        .send({
          status: "completed",
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("status");
      expect(response.body.status).toBe("completed");
    });

    it("Deve retornar erro ao alterar status de reembolso com ID inválido", async () => {
      const response = await request(app.server)
        .patch("/refund/status/99999")
        .send({
          status: "completed",
        });

      expect(response.statusCode).toBe(404);
    });
    it("Deve retornar erro ao alterar status de reembolso com ID não numérico", async () => {
      const response = await request(app.server)
        .patch("/refund/status/abc")
        .send({
          status: "completed",
        });

      expect(response.statusCode).toBe(400);
    });
    it("Deve retornar erro ao alterar status de reembolso com o ID negativo", async () => {
      const response = await request(app.server)
        .patch("/refund/status/-1")
        .send({
          status: "completed",
        });

      expect(response.statusCode).toBe(400);
    });
    it("Deve retornar erro ao alterar status de reembolso com status inválido", async () => {
      const response = await request(app.server)
        .patch("/refund/status/1")
        .send({
          status: "finalized",
        });

      expect(response.statusCode).toBe(400);
    });
  });
});
