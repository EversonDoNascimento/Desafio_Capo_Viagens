export const createPartialRefundSchema = {
  summary: "Cria um reembolso parcial ",
  tags: ["Reembolsos"],
  body: {
    type: "object",
    // Retirando a validação do swagger, pois a validação é feita no controller pelo zod
    // required: ["amount", "paymentId"],
    properties: {
      amount: { type: "number" },
      paymentId: { type: "number" },
    },
  },
  response: {
    201: {
      description: "Reembolso criado com sucesso",
      type: "object",
      properties: {
        id: { type: "number" },
        amount: { type: "number" },
        status: { type: "string" },
        paymentId: { type: "number" },
        type: { type: "string" },
        refundDate: { type: "string" },
      },
      required: ["id", "amount", "status", "paymentId", "type", "refundDate"],
    },
    400: {
      description: "Erro de validação",
      type: "object",
      properties: {
        error: { type: "string" },
        issues: {
          type: "array",
          items: {
            type: "object",
            properties: {
              code: { type: "string" },
              message: { type: "string" },
              path: {
                type: "array",
                items: { type: "string" },
              },
              expected: { type: "string" },
            },
            required: ["code", "message", "path"],
          },
        },
      },
      required: ["error"],
    },
  },
};

export const createFullRefundSchema = {
  summary: "Cria um reembolso  total",
  tags: ["Reembolsos"],
  body: {
    type: "object",
    // Retirando a validação do swagger, pois a validação é feita no controller pelo zod
    // required: ["paymentId"],
    properties: {
      paymentId: { type: "number" },
    },
  },
  response: {
    201: {
      description: "Reembolso criado com sucesso",
      type: "object",
      properties: {
        id: { type: "number" },
        amount: { type: "number" },
        status: { type: "string" },
        paymentId: { type: "number" },
        type: { type: "string" },
        refundDate: { type: "string" },
      },
      required: ["id", "amount", "status", "paymentId", "type", "refundDate"],
    },
    400: {
      description: "Erro de validação",
      type: "object",
      properties: {
        error: { type: "string" },
        issues: {
          type: "array",
          items: {
            type: "object",
            properties: {
              expected: { type: "string" },
              code: { type: "string" },
              message: { type: "string" },
              path: {
                type: "array",
                items: { type: "string" },
              },
            },
            required: ["code", "message", "path"],
          },
        },
      },
      required: ["error"],
      example: {
        error: "Dados inválidos!",
        issues: [
          {
            code: "too_small",
            message: "O paymentId deve ser positivo",
            path: ["paymentId"],
          },
        ],
      },
    },
  },
};
export const modifyStatusRefundSchema = {
  summary: "Modifica o status de um reembolso",
  tags: ["Reembolsos"],
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "number" },
    },
  },
  body: {
    type: "object",
    // Retirando a validação do swagger, pois a validação é feita no controller pelo zod
    // required: ["status"],
    properties: {
      status: { type: "string" },
    },
  },
  response: {
    200: {
      description: "Status do reembolso modificado com sucesso",
      type: "object",
      properties: {
        id: { type: "number" },
        amount: { type: "number" },
        status: { type: "string" },
        paymentId: { type: "number" },
        type: { type: "string" },
        refundDate: { type: "string" },
      },
      required: ["id", "amount", "status", "paymentId", "type", "refundDate"],
    },
    400: {
      description: "Erro de validação",
      type: "object",
      properties: {
        error: { type: "string" },
        issues: {
          type: "array",
          items: {
            type: "object",
            properties: {
              expected: { type: "string" },
              code: { type: "string" },
              message: { type: "string" },
              path: {
                type: "array",
                items: { type: "string" },
              },
            },
            required: ["code", "message", "path"],
          },
        },
      },
      required: ["error"],

      example: {
        error: "Invalid amount format",
        issues: [
          {
            code: "too_small",
            message: "Too small: expected number to be >0",
            path: ["amount"],
          },
        ],
      },
    },
  },
  example: {
    status: "completed",
  },
};

export const getRefundByIDSchema = {
  summary: "Busca um reembolso pelo ID",
  tags: ["Reembolsos"],
  params: {
    type: "object",
    // Retirando a validação do swagger, pois a validação é feita no controller pelo zod
    // required: ["id"],
    properties: {
      id: { type: "number" },
    },
  },
  response: {
    200: {
      description: "Reembolso encontrado",
      type: "object",
      properties: {
        id: { type: "number" },
        amount: { type: "number" },
        status: { type: "string" },
        paymentId: { type: "number" },
        type: { type: "string" },
        refundDate: { type: "string" },
      },
      required: ["id", "amount", "status"],
    },

    400: {
      description: "Erro de validação",
      type: "object",
      properties: {
        error: { type: "string" },
        issues: {
          type: "array",
          items: {
            type: "object",
            properties: {
              expedted: { type: "string" },
              code: { type: "string" },
              message: { type: "string" },
              path: {
                type: "array",
                items: { type: "string" },
              },
            },
            required: ["code", "message", "path"],
          },
        },
      },
    },
    404: {
      description: "Reembolso não encontrado",
      type: "object",
      properties: {
        error: { type: "string" },
      },
      required: ["error"],
      example: {
        error: "Refund not found",
      },
    },
  },
};
