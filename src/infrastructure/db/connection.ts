import { createPool } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// criando a conexão com o banco de dados
const pool = createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  port: parseInt(process.env.DB_PORT || "3306"),
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "payments",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
