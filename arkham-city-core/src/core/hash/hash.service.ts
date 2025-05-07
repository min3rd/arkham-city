import { AES, enc, SHA256 } from 'crypto-js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HashService {
  public static hash(value: string) {
    return SHA256(value).toString(enc.Hex);
  }

  public static compare(target: string, hash: string) {
    return SHA256(target).toString(enc.Hex) === hash;
  }

  public static encrypt<T>(value: T, key: string): string {
    return AES.encrypt(JSON.stringify(value), key).toString();
  }

  public static decrypt<T>(encrypted: string, key: string): T | null {
    const decrypted = AES.decrypt(encrypted, key).toString(enc.Utf8);
    try {
      return JSON.parse(decrypted) as T;
    } catch (e) {
      return null;
    }
  }
}
