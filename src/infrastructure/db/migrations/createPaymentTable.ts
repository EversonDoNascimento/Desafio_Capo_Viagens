import pool from "../connection";

// Função para criar a tabela de pagamentos
export async function createPaymentTable() {
  try {
    await pool.query(`
          CREATE TABLE IF NOT EXISTS payments (
              id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
              amount DECIMAL(10, 2) NOT NULL,
              method VARCHAR(255) NOT NULL,
              status ENUM('pending', 'completed', 'failed') DEFAULT 'pending' NOT NULL,
              card_number VARCHAR(255),
              buyer_name VARCHAR(255) NOT NULL,
              buyer_email VARCHAR(255) NOT NULL,
              payment_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          );
      `);
    console.log("Payment table created successfully.");
  } catch (error) {
    console.error("Error creating payment table:", error);
  } finally {
    await pool.end();
  }
}
