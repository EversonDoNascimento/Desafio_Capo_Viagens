import { encrypt, decrypt } from "../../../shared/utils/crypt";

describe("Tetes de Criptografia", () => {
  it("Deve encriptar um texto", () => {
    const text = "Texto de teste";
    const encryptedText = encrypt(text);
    const decryptedText = decrypt(encryptedText);
    expect(encryptedText).toBeDefined();
    expect(encryptedText).toMatch(/^[a-f0-9]{32}:[a-f0-9]+$/);
    expect(decryptedText).toBe(text);
  });
});
