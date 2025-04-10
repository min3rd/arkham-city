import * as bcrypt from 'bcrypt';
import * as CryptoJS from 'crypto-js';
export class HashService {
  static saltOrRounds = 10;
  static hash(value: string) {
    return bcrypt.hashSync(value, this.saltOrRounds);
  }
  static compare(target: string, hash: string) {
    return bcrypt.compareSync(target, hash);
  }
  static encrypt<T>(value: T, key: string): string {
    return CryptoJS.AES.encrypt(JSON.stringify(value), key).toString();
  }
  static decrypt<T>(encrypted: string, key: string): T | null {
    const decrypted = CryptoJS.AES.decrypt(encrypted, key).toString(
      CryptoJS.enc.Utf8,
    );
    try {
      return JSON.parse(decrypted) as T;
    } catch (e) {
      return null;
    }
  }
}
