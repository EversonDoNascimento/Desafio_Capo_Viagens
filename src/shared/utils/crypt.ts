import crypto from "node:crypto";
import dotenv from "dotenv";

dotenv.config();

const algorithm = "aes-256-cbc";

const key = crypto.scryptSync(process.env.ENCRYPTION_KEY!, "salt", 32);

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16); // novo a cada vez
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decrypt(encryptedText: string): string {
  const [ivHex, dataHex] = encryptedText.split(":");

  if (!ivHex || !dataHex) {
    throw new Error("Formato inválido para descriptografar");
  }

  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(dataHex, "hex");

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
