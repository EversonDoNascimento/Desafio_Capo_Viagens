import Refund from "../../../domain/entities/Refund";
import RefundRepository from "../../../domain/repositories/RefundRepository";
import CreateRefund from "../../../application/use-cases/CreateRefund";
import FindRefundById from "../../../application/use-cases/FindRefundById";

const fakeRepo: jest.Mocked<RefundRepository | any> = {
  create: jest.fn(),
  findById: jest.fn(),
};

describe("FindRefundById UseCase", () => {
  it("Deve encontrar um reembolso pelo ID", async () => {
    const findRefundById = new FindRefundById(fakeRepo);

    const refundData = new Refund({
      id: 1,
      paymentId: 1,
      amount: 100,
      type: "full",
      status: "pending",
      refundDate: new Date(),
    });

    await findRefundById.execute(refundData.getId() as number);
    expect(fakeRepo.findById).toHaveBeenCalledWith(
      refundData.getId() as number
    );
  });
});
