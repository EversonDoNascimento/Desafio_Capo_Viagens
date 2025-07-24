// Definindo os schemas do swagger das rotas de pagamentos

export const healthCheckSchema = {
  summary: "Verifica a saúde do serviço",
  tags: ["Saúde"],
  response: {
    200: {
      description: "Serviço está funcionando corretamente",
      type: "object",
      properties: {
        status: { type: "string", enum: ["ok"] },
      },

      required: ["status"],
    },
    500: {
      description: "Erro interno do servidor",
      type: "object",
      properties: {
        error: { type: "string" },
      },
      required: ["error"],
    },
  },
};

export const createPaymentSchema = {
  summary: "Cria um novo pagamento",
  tags: ["Pagamentos"],
  body: {
    type: "object",
    // Retirando a validação do swagger, pois a validação é feita no controller pelo zod
    // required: ["amount", "method", "buyer"],
    properties: {
      amount: { type: "number" },
      method: { type: "string", enum: ["credit_card", "pix"] },
      card: {
        type: "object",
        properties: {
          encryptedData: { type: "string" },
        },
        required: ["encryptedData"],
      },
      buyer: {
        type: "object",
        required: ["name", "email"],
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
        },
      },
    },
  },
  response: {
    201: {
      description: "Pagamento criado com sucesso",
      type: "object",
      properties: {
        id: { type: "number" },
        amount: { type: "number" },
        method: { type: "string" },
        paymentDate: { type: "string" },
        status: { type: "string" },
        card: {
          type: "object",
          properties: {
            encryptedData: { type: "string" },
          },
        },
        buyer: {
          type: "object",
          properties: {
            name: { type: "string" },
            email: { type: "string" },
          },
        },
      },
      required: ["id", "amount", "method", "status", "buyer"],
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
              expected: { type: "string" },
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
            code: "custom",
            message:
              "Informações do cartão não podem ser fornecidas para pagamento com PIX.",
            path: ["card"],
          },
        ],
      },
    },
  },
};

export const getPaymentByIDSchema = {
  summary: "Busca um pagamento pelo ID",
  tags: ["Pagamentos"],
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
      description: "Pagamento encontrado",
      type: "object",
      properties: {
        id: { type: "number" },
        amount: { type: "number" },
        method: { type: "string" },
        paymentDate: { type: "string" },
        status: { type: "string" },
        card: {
          type: "object",
          properties: {
            encryptedData: { type: "string" },
          },
        },
        buyer: {
          type: "object",
          properties: {
            name: { type: "string" },
            email: { type: "string" },
          },
        },
      },
      required: ["id", "amount", "method", "status", "buyer"],
    },

    404: {
      description: "Pagamento não encontrado",
      type: "object",
      properties: {
        error: { type: "string" },
      },
      required: ["error"],
      example: {
        error: "Payment not found",
      },
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
              expected: { type: "string" },
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
        error: "Invalid ID format",
        issues: [
          {
            code: "too_small",
            message: "O ID deve ser positivo",
            path: ["id"],
          },
        ],
      },
    },
  },
};

export const modifyStatusPaymentSchema = {
  summary: "Modifica o status de um pagamento",
  tags: ["Pagamentos"],
  params: {
    type: "object",
    // Retirando a validação do swagger, pois a validação é feita no controller pelo zod
    // required: ["id"],
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
      description: "Status do pagamento modificado com sucesso",
      type: "object",
      properties: {
        id: { type: "number" },
        amount: { type: "number" },
        paymentDate: { type: "string" },
        method: { type: "string" },
        status: { type: "string" },
        card: {
          type: "object",
          properties: {
            encryptedData: { type: "string" },
          },
        },
        buyer: {
          type: "object",
          properties: {
            name: { type: "string" },
            email: { type: "string" },
          },
        },
      },
      required: ["id", "amount", "method", "status", "buyer"],
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
        error: "string",
        issues: [
          {
            code: "string",
            message: "string",
            path: ["id"],
          },
        ],
      },
    },
    404: {
      description: "Pagamento não encontrado",
      type: "object",
      properties: {
        error: { type: "string" },
      },
      required: ["error"],
      example: {
        error: "Payment not found",
      },
      500: {
        description: "Erro interno do servidor",
        type: "object",
        properties: {
          error: { type: "string" },
        },
        required: ["error"],
        example: {
          error: "Internal server error",
        },
      },
    },
  },
};
