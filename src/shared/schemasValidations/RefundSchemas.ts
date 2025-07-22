import z from "zod";

export const SchemaFullRefund = z.object({
  paymentId: z.number().int().positive(),
});

export const SchemaPartialRefund = z.object({
  paymentId: z.number().int().positive(),
  amount: z.number().positive(),
});

export const SchemaFindRefundById = z.object({
  id: z.coerce.number().int().positive(),
});

export const SchemaModifyRefundStatus = z.object({
  status: z.enum(["pending", "completed", "failed"]),
});
