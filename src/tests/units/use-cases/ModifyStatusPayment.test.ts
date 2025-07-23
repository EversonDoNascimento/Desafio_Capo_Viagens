import Payment from "../../../domain/entities/Payment";
import PaymentRepository from "../../../domain/repositories/PaymentRepository";
import ModifyStatusPayment from "../../../application/use-cases/ModifyStatusPayment";

const fakeRepo: jest.Mocked<PaymentRepository | any> = {
  modifyStatusPayment: jest.fn(),
};

describe("ModifyStatusPayment UseCase", () => {
  it("Deve alterar o status do pagamento", async () => {
    const modifyStatusPayment = new ModifyStatusPayment(fakeRepo);

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

    await modifyStatusPayment.execute(paymentData.getId() as number, "pending");
    expect(fakeRepo.modifyStatusPayment).toHaveBeenCalledWith(
      parseInt(`${paymentData.getId()}`),
      "pending"
    );
  });
});
