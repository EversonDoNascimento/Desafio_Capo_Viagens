import { createPaymentTable } from "../infrastructure/db/migrations/createPaymentTable";

async function migrate() {
  try {
    await createPaymentTable();
    console.log("Migration completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
