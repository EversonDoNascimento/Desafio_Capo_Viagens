import z from "zod";

// Validação para os dados de criação de um reembolso que são recebidos pelo controller

// O ID do pagamento deve ser um número inteiro positivo
export const SchemaFullRefund = z.object({
  paymentId: z.number().int().positive(),
});

// O ID do pagamento deve ser um número inteiro positivo, e o valor do reembolso deve ser um número positivo
export const SchemaPartialRefund = z.object({
  paymentId: z.number().int().positive(),
  amount: z.number().positive(),
});

// O ID do reembolso deve ser um número inteiro positivo
export const SchemaFindRefundById = z.object({
  // o coerce transforma o id em um number, pois o id vem como string
  id: z.coerce.number().int().positive(),
});

export const SchemaModifyRefundStatus = z.object({
  // o status deve ser 'pending', 'completed' ou 'failed'
  status: z.enum(["pending", "completed", "failed"]),
});
