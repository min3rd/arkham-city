import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class HashService {
  saltOrRounds = 10;
  hash(value: string) {
    return bcrypt.hashSync(value, this.saltOrRounds);
  }
  compare(target: string, hash: string) {
    return bcrypt.compareSync(target, hash);
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
