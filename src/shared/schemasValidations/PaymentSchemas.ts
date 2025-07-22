import { z } from "zod";

export const SchemaCreatePayment = z
  .object({
    method: z.enum(["credit_card", "pix"], {
      message: "O método de pagamento deve ser 'credit_card' ou 'pix'.",
    }),
    amount: z
      .number("O valor deve ser um número")
      .positive("O valor deve ser positivo"),
    card: z
      .object({
        encryptedData: z.string().length(16, {
          message: "O número do cartão deve ter 16 dígitos.",
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
    if (data.method === "pix" && data.card) {
      ctx.issues.push({
        code: "custom",
        message:
          "Informações do cartão não podem ser fornecidas para pagamento com PIX.",
        path: ["card"],
        input: data.card,
      });
    }
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

export const SchemaFindPaymentById = z.object({
  id: z.coerce
    .number("O ID deve ser um número")
    .int("O ID deve ser um número inteiro")
    .positive("O ID deve ser positivo"),
});

export const SchemaStatusPayment = z.object({
  status: z.enum(["pending", "completed", "failed"], {
    message: "O status deve ser 'pending', 'completed' ou 'failed'.",
  }),
});
