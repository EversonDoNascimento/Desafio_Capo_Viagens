import pool from "../connection";

export async function createPaymentTable() {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS payments (
            id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
            amount DECIMAL(10, 2) NOT NULL,
            method VARCHAR(255) NOT NULL,
            card_number VARCHAR(255),
            buyer_name VARCHAR(255) NOT NULL,
            buyer_email VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
    `);
  console.log("Payment table created successfully.");
}
