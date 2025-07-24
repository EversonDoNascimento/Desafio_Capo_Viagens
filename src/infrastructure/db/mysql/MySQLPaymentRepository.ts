import Payment from "../../../domain/entities/Payment";
import PaymentRepository from "../../../domain/repositories/PaymentRepository";
import pool from "../connection";
import { RowDataPacket } from "mysql2";
// Definindo os tipos das colunas da tabela
interface PaymentRow extends RowDataPacket {
  id: number;
  amount: number;
  method: string;
  card_number: string | null;
  buyer_name: string;
  buyer_email: string;
  status: "pending" | "completed" | "failed";
  payment_date: Date;
}

export default class MySQLPaymentRepository extends PaymentRepository {
  async create(payment: Payment): Promise<Payment | null> {
    // A operação está envolvida em um bloco try-catch, pois pode ocorrer um erro
    try {
      // insere o pagamento na tabela utilizando a query
      // o insert into payments (amount, method, card_number, buyer_name, buyer_email)
      const [result] = await pool.query(
        `
        INSERT INTO payments (amount, method, card_number, buyer_name, buyer_email)
        VALUES (?, ?, ?, ?, ?)
      `,
        [
          payment.getAmount(),
          payment.getMethod(),
          // Se o retorno de getEncryptedCardIfApplicable for nulo, insere null, caso contrario insere o encryptedData
          payment.getEncryptedCardIfApplicable(),
          payment.getBuyer().name,
          payment.getBuyer().email,
        ]
      );
      // verifica se o pagamento foi criado
      if ("affectedRows" in result && result.affectedRows === 1) {
        return this.findById(result.insertId);
      } else {
        // caso contrario retorna null
        return null;
      }
    } catch (error) {
      console.error("Error creating payment in MySQL:", error);
      throw new Error("Failed to create payment in MySQL.");
    }
  }

  async findById(id: number): Promise<Payment | null> {
    try {
      // busca o pagamento pelo ID
      const [rows] = await pool.query<PaymentRow[]>(
        `SELECT * FROM payments WHERE id = ?`,
        [id]
      );
      // verifica se o pagamento foi encontrado
      if (rows.length > 0) {
        // pegando a primeira linha que contém os dados do pagamento
        const row = rows[0];
        // criando uma instância da classe Payment para retornar de acordo com o repository
        return new Payment({
          id: row.id,
          amount: parseFloat(row.amount.toString()),
          method: row.method,
          status: row.status,
          paymentDate: row.payment_date,
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
    // retornar null caso não seja encontrado
    return null;
  }

  async modifyStatusPayment(
    id: number,
    status: "pending" | "completed" | "failed"
  ) {
    try {
      // modifica o status do pagamento
      const [result] = await pool.query(
        `UPDATE payments SET status = ? WHERE id = ?`,
        [status, id]
      );

      if ("affectedRows" in result && result.affectedRows === 1) {
        // Busca o pagamento modificado e retorna
        return this.findById(id);
      } else {
        // caso contrario retorna null
        return null;
      }
    } catch (error) {
      console.error("Error modifying payment status in MySQL:", error);
      throw new Error("Failed to modify payment status in MySQL.");
    }
  }
}
