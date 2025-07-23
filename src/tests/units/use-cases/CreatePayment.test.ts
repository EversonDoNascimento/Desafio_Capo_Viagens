import z from "zod";
import CreatePayment from "../../../application/use-cases/CreatePayment";
import PaymentRepository from "../../../domain/repositories/PaymentRepository";
import { SchemaCreatePayment } from "../../../shared/schemasValidations/PaymentSchemas";

const fakeRepo: jest.Mocked<PaymentRepository | any> = {
  create: jest.fn(),
};

describe("CreatePayment UseCase", () => {
  it("Deve criptografar dados do cartão quando método for credit_card", async () => {
    const createPayment = new CreatePayment(fakeRepo);

    const paymentData = {
      amount: 100,
      method: "credit_card",
      card: {
        encryptedData: "123456789",
      },
      buyer: {
        name: "João",
        email: "joao@email.com",
      },
    };

    await createPayment.execute(
      paymentData as z.infer<typeof SchemaCreatePayment>
    );

    expect(fakeRepo.create).toHaveBeenCalled();
    expect(fakeRepo.create.mock.calls[0][0].getCard()?.encryptedData).not.toBe(
      "123456789"
    );
  });
});
