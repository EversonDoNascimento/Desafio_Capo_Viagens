import RefundRepository from "../../../domain/repositories/RefundRepository";
import ModifyStatusRefund from "../../../application/use-cases/ModifyStatusRefund";

const fakeRepo: jest.Mocked<RefundRepository | any> = {
  modifyStatus: jest.fn(),
};

describe("ModifyStatusRefund UseCase", () => {
  it("Deve alterar o status do reembolso", async () => {
    const modifyStatusRefund = new ModifyStatusRefund(fakeRepo);
    await modifyStatusRefund.execute(1, "pending");
    expect(fakeRepo.modifyStatus).toHaveBeenCalledWith(1, "pending");
  });
});
