import { createPaymentTable } from "../infrastructure/db/migrations/createPaymentTable";
import { createRefundTable } from "../infrastructure/db/migrations/createRefundTable";

async function migrate() {
  try {
    await createPaymentTable();
    await createRefundTable();
    console.log("Migration completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
