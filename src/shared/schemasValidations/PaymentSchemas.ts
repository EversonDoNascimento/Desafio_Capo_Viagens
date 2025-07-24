import { z } from "zod";
// Validação para os dados de criação de um pagamento que são recebidos pelo controller

export const SchemaCreatePayment = z
  .object({
    // Definindo que o método de pagamento deve ser 'credit_card' ou 'pix'
    method: z.enum(["credit_card", "pix"], {
      message: "O método de pagamento deve ser 'credit_card' ou 'pix'.",
    }),
    // Definindo que o valor do pagamento deve ser um número positivo
    amount: z
      .number("O valor deve ser um número")
      .positive("O valor deve ser positivo"),
    // A propriedade card é opcional, pois pode ser que o pagamento seja feito com PIX
    // A propriedade card deve ter 16 dígitos
    card: z
      .object({
        encryptedData: z.string().min(16, {
          message: "O número do cartão deve ter pelo menos 16 dígitos.",
        }),
      })
      .optional(),
    buyer: z.object({
      name: z.string().min(1),
      email: z.email("O e-mail do comprador deve ser válido."),
    }),
  })
  .check((ctx) => {
    const data = ctx.value;
    // Verificando se o cartão foi fornecido para pagamento com PIX, caso tenha sido fornecido retorna um erro
    if (data.method === "pix" && data.card) {
      ctx.issues.push({
        code: "custom",
        message:
          "Informações do cartão não podem ser fornecidas para pagamento com PIX.",
        path: ["card"],
        input: data.card,
      });
    }
    // Verificando se o cartão foi fornecido para pagamento com cartão de crédito, caso não tenha sido fornecido retorna um erro
    if (data.method === "credit_card" && !data.card) {
      ctx.issues.push({
        code: "custom",
        message:
          "Informações do cartão são obrigatórias para pagamento com cartão de crédito.",
        path: ["card"],
        input: data.card,
      });
    }
  });
// Validação para os dados de busca de um pagamento por ID
// O ID é um número inteiro positivo
// O ID é obrigatório
// O ID é um número
export const SchemaFindPaymentById = z.object({
  id: z.coerce
    .number("O ID deve ser um número")
    .int("O ID deve ser um número inteiro")
    .positive("O ID deve ser positivo"),
});

// Validação para o status de um pagamento
// O status é obrigatório
// O status deve ser 'pending', 'completed' ou 'failed'
export const SchemaStatusPayment = z.object({
  status: z.enum(["pending", "completed", "failed"], {
    message: "O status deve ser 'pending', 'completed' ou 'failed'.",
  }),
});
