import Refund from "../../../domain/entities/Refund";
import RefundRepository from "../../../domain/repositories/RefundRepository";
import CreateRefund from "../../../application/use-cases/CreateRefund";
const fakeRepo: jest.Mocked<RefundRepository | any> = {
  create: jest.fn(),
};

describe("CreateRefund UseCase", () => {
  it("Deve criar um novo reembolso", async () => {
    const createRefund = new CreateRefund(fakeRepo);

    const refundData = new Refund({
      paymentId: 1,
      amount: 100,
      type: "full",
      status: "pending",
      refundDate: new Date(),
    });

    await createRefund.execute(refundData as Refund);
    expect(fakeRepo.create).toHaveBeenCalledWith(refundData);
  });
});
