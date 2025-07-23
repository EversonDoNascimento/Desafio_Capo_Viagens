import { FindPaymentById } from "../../../application/use-cases/FindPaymentById";
import Payment from "../../../domain/entities/Payment";
import PaymentRepository from "../../../domain/repositories/PaymentRepository";

const fakeRepo: jest.Mocked<PaymentRepository | any> = {
  create: jest.fn(),
  findById: jest.fn(),
};

describe("FindPaymentById UseCase", () => {
  it("Deve encontrar um pagamento pelo ID", async () => {
    const findPaymentById = new FindPaymentById(fakeRepo);

    const paymentData = new Payment({
      id: 1,
      amount: 100,
      method: "credit_card",
      card: {
        encryptedData: "123456789",
      },
      buyer: {
        name: "João",
        email: "joao@email.com",
      },
    });

    await findPaymentById.execute(paymentData.getId() as number);
    expect(fakeRepo.findById).toHaveBeenCalledWith(
      parseInt(`${paymentData.getId()}`)
    );
  });
});
