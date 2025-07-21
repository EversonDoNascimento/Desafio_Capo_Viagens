import Payment from "../../../domain/entities/Payment";
import PaymentRepository from "../../../domain/repositories/PaymentRepository";
import pool from "../connection";
import { RowDataPacket } from "mysql2";
interface PaymentRow extends RowDataPacket {
  id: number;
  amount: number;
  method: string;
  card_number: string | null;
  buyer_name: string;
  buyer_email: string;
}

export default class MySQLPaymentRepository extends PaymentRepository {
  async create(payment: Payment) {
    try {
      const [result] = await pool.query(
        `
        INSERT INTO payments (amount, method, card_number, buyer_name, buyer_email)
        VALUES (?, ?, ?, ?, ?)
      `,
        [
          payment.getAmount(),
          payment.getMethod(),
          payment.getEncryptedCardIfApplicable(),
          payment.getBuyer().name,
          payment.getBuyer().email,
        ]
      );

      if ("affectedRows" in result && result.affectedRows === 1) {
        return {
          success: true,
          id: result.insertId,
        };
      } else {
        return {
          success: false,
        };
      }
    } catch (error) {
      console.error("Error creating payment in MySQL:", error);
      throw new Error("Failed to create payment in MySQL.");
    }
  }

  async findById(id: number): Promise<Payment | null> {
    try {
      const [rows] = await pool.query<PaymentRow[]>(
        `SELECT * FROM payments WHERE id = ?`,
        [id]
      );

      if (rows.length > 0) {
        const row = rows[0];
        return new Payment({
          id: row.id.toString(),
          amount: parseFloat(row.amount.toString()),
          method: row.method,
          card: row.card_number
            ? { encryptedData: row.card_number }
            : undefined,
          buyer: {
            name: row.buyer_name,
            email: row.buyer_email,
          },
        });
      }
    } catch (error) {
      console.error("Error finding payment by ID in MySQL:", error);
      throw new Error("Failed to find payment by ID in MySQL.");
    }

    return null;
  }
}
