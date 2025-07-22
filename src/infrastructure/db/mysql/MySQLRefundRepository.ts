import { RowDataPacket } from "mysql2";
import Refund from "../../../domain/entities/Refund";
import RefundRepository from "../../../domain/repositories/RefundRepository";
import pool from "../connection";

interface RefundRow extends RowDataPacket {
  id: number;
  payment_id: number;
  amount: number;
  status: "pending" | "completed" | "failed";
  type: "partial" | "full";
  refund_date: Date;
}
export default class MySQLRefundRepository extends RefundRepository {
  async create(refund: Refund): Promise<{ id?: number; success: boolean }> {
    try {
      const [result] = await pool.query(
        `INSERT INTO refunds (payment_id, amount, type) VALUES (?, ?, ?)`,
        [refund.getPaymentId(), refund.getAmount(), refund.getType()]
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
      console.error("Error creating refund in MySQL:", error);
      throw new Error("Failed to create refund in MySQL.");
    }
  }
  async findById(id: number): Promise<Refund | null> {
    try {
      const [rows] = await pool.query<RefundRow[]>(
        `SELECT * FROM refunds WHERE id = ?`,
        [id]
      );

      if (rows.length > 0) {
        const row = rows[0];
        return new Refund({
          id: row.id,
          paymentId: row.payment_id,
          amount: row.amount,
          status: row.status,
          refundDate: new Date(row.refund_date),
          type: row.type,
        });
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error finding refund by ID in MySQL:", error);
      throw new Error("Failed to find refund by ID in MySQL.");
    }
  }
  async modifyStatus(id: number, status: "pending" | "completed" | "failed") {
    try {
      const [result] = await pool.query(
        `UPDATE refunds SET status = ? WHERE id = ?`,
        [status, id]
      );

      if ("affectedRows" in result && result.affectedRows === 1) {
        return this.findById(id);
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error modifying refund status in MySQL:", error);
      throw new Error("Failed to modify refund status in MySQL.");
    }
  }
}
