import crypto from "node:crypto";
import dotenv from "dotenv";

dotenv.config();

// criando o algoritmo de criptografia
const algorithm = "aes-256-cbc";

// criando a chave de criptografia
const key = crypto.scryptSync(process.env.ENCRYPTION_KEY!, "salt", 32);

// criando a função de encriptação
export function encrypt(text: string): string {
  // Gerando um IV aleatório
  const iv = crypto.randomBytes(16);
  // Criando o cipher com o algoritmo, a chave e o IV
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  // Encriptando o texto com o cipher
  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);
  // Retornando o IV e o texto encriptado
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

// criando a função de descriptografia
export function decrypt(encryptedText: string): string {
  // separando o IV e o texto
  const [ivHex, dataHex] = encryptedText.split(":");
  // validando o formato
  if (!ivHex || !dataHex) {
    throw new Error("Formato inválido para descriptografar");
  }
  // convertendo para buffer
  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(dataHex, "hex");
  // criando o cipher
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
