import pool from "../connection";

// Função para criar a tabela de reembolsos
export async function createRefundTable() {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS refunds (
            id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
            payment_id INT NOT NULL,
            FOREIGN KEY (payment_id) REFERENCES payments(id),
            amount DECIMAL(10, 2) NOT NULL,
            type ENUM('partial', 'full') NOT NULL,
            status ENUM('pending', 'completed', 'failed') DEFAULT 'pending' NOT NULL,
            refund_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
    `);
  console.log("Refund table created successfully.");
}
