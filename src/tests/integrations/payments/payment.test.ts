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

// Testes de integração usando supertest para as rotas de pagamento

describe("Testes nas rotas de pagamento", () => {
  describe("Criar Pagamento", () => {
    it("Deve criar um novo pagamento no PIX", async () => {
      // Criando a requisição POST para a rota de criação de pagamento
      // enviando os dados do pagamento
      const response = await request(app.server)
        .post("/payments")
        .send({
          amount: 100,
          method: "pix",
          buyer: {
            name: "João",
            email: "joao@email.com",
          },
        });
      // Verificando o status da resposta
      expect(response.statusCode).toBe(201);
    });

    it("Deve criar um novo pagamento no cartão de crédito", async () => {
      const response = await request(app.server)
        .post("/payments")
        .send({
          amount: 100,
          method: "credit_card",
          card: {
            encryptedData: "1234567890123456",
          },
          buyer: {
            name: "João",
            email: "joao@email.com",
          },
        });

      expect(response.statusCode).toBe(201);
    });
    it("Deve retornar erro ao criar pagamento com método inválido", async () => {
      // O método de pagamento debit_card que está sendo passado, irá retornar um erro, o teste deve falhar
      const response = await request(app.server)
        .post("/payments")
        .send({
          amount: 100,
          method: "debit_card",
          buyer: {
            name: "João",
            email: "joao@email.com",
          },
        });

      expect(response.statusCode).toBe(400);
    });

    it("Deve retornar erro ao criar pagamento sem informações do cartão", async () => {
      // Se o pagamento for via cartão de crédito, ele precisa de um cartão para ser criado
      const response = await request(app.server)
        .post("/payments")
        .send({
          amount: 100,
          method: "credit_card",
          buyer: {
            name: "João",
            email: "joao@email.com",
          },
        });

      expect(response.statusCode).toBe(400);
    });

    it("Deve retornar erro ao criar pagamento sem informações do comprador", async () => {
      // Não podemos criar um pagamento sem informações do comprador
      const response = await request(app.server).post("/payments").send({
        amount: 100,
        method: "pix",
      });

      expect(response.statusCode).toBe(400);
    });
    it("Deve retornar erro ao criar pagamento com valor negativo", async () => {
      // Não podemos criar um pagamento com um valor negativo
      const response = await request(app.server)
        .post("/payments")
        .send({
          amount: -100,
          method: "pix",
          buyer: {
            name: "João",
            email: "joao@email.com",
          },
        });

      expect(response.statusCode).toBe(400);
    });

    it("Deve retornar erro ao criar pagamento com valor zero", async () => {
      const response = await request(app.server)
        .post("/payments")
        .send({
          amount: 0,
          method: "pix",
          buyer: {
            name: "João",
            email: "joao@email.com",
          },
        });

      expect(response.statusCode).toBe(400);
    });
  });
  describe("Buscar Pagamento por ID", () => {
    it("Deve buscar um pagamento existente por ID", async () => {
      const response = await request(app.server).get("/payments/1");

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("id");
      expect(response.body.id).toBe(1);
    });

    it("Deve retornar erro ao buscar pagamento com ID inválido", async () => {
      // Foi passado um ID inválido
      const response = await request(app.server).get("/payments/99999");

      expect(response.statusCode).toBe(404);
    });
    it("Deve retornar erro ao buscar pagamento com ID não numérico", async () => {
      const response = await request(app.server).get("/payments/abc");

      expect(response.statusCode).toBe(400);
    });
    it("Deve retornar erro ao buscar pagamento com o ID negativo", async () => {
      const response = await request(app.server).get("/payments/-1");

      expect(response.statusCode).toBe(400);
    });
  });
  describe("Alterar Status do Pagamento", () => {
    it("Deve alterar o status do pagamento", async () => {
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
        .patch(`/payments/status/${createPayment.body.id}`)
        .send({
          status: "completed",
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("status");
      expect(response.body.status).toBe("completed");
      expect(response.body).toHaveProperty("id");
      expect(response.body.id).toBe(createPayment.body.id);
    });

    it("Deve retornar erro ao alterar status do pagamento com ID inválido", async () => {
      const response = await request(app.server)
        .patch("/payments/status/99999")
        .send({
          status: "completed",
        });

      expect(response.statusCode).toBe(404);
    });
    it("Deve retornar erro ao alterar status do pagamento com ID não numérico", async () => {
      const response = await request(app.server)
        .patch("/payments/status/abc")
        .send({
          status: "completed",
        });

      expect(response.statusCode).toBe(400);
    });
    it("Deve retornar erro ao alterar status do pagamento com o ID negativo", async () => {
      const response = await request(app.server)
        .patch("/payments/status/-1")
        .send({
          status: "completed",
        });

      expect(response.statusCode).toBe(400);
    });
    it("Deve retornar erro ao alterar status do pagamento sem status", async () => {
      const response = await request(app.server)
        .patch("/payments/status/1")
        .send({});

      expect(response.statusCode).toBe(400);
    });
    it("Deve retornar erro ao alterar status do pagamento com status inválido", async () => {
      const response = await request(app.server)
        .patch("/payments/status/1")
        .send({
          status: "finalized",
        });

      expect(response.statusCode).toBe(400);
    });
  });
});
