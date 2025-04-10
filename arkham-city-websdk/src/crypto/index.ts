import CryptoJS from 'crypto-js';

export class CryptoService {
  private static _instance: CryptoService;
  public static get instance() {
    if (!this._instance) {
      this._instance = new CryptoService();
    }
    return this._instance;
  }
  encrypt<T>(value: T, key: string): string {
    return CryptoJS.AES.encrypt(JSON.stringify(value), key).toString();
  }
  decrypt<T>(encrypted: string, key: string): T | null {
    const decrypted = CryptoJS.AES.decrypt(encrypted, key).toString(
      CryptoJS.enc.Utf8,
    );
    try {
      return JSON.parse(decrypted) as T;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}

export const crypto = () => {
  return CryptoService.instance;
};
