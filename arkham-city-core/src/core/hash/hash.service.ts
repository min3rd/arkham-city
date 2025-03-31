import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

@Injectable()
export class HashService {
  saltOrRounds = 10;
  hash(value: string) {
    return bcrypt.hashSync(value, this.saltOrRounds);
  }
  compare(target: string, hash: string) {
    return bcrypt.compareSync(target, hash);
  }
  encrypt<T>(value: T, key: string) {
    const keyBuffer = Buffer.from(key, 'base64');
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', keyBuffer, iv);
    return Buffer.concat([
      iv,
      cipher.update(JSON.stringify(value)),
      cipher.final(),
    ]).toString('base64url');
  }
  decrypt<T>(encrypted: string, key: string): T {
    const keyBuffer = Buffer.from(key, 'base64');
    const ivCipherText = Buffer.from(encrypted, 'base64url');
    const iv = ivCipherText.subarray(0, 12);
    const cipherText = ivCipherText.subarray(12);
    const cipher = createDecipheriv('aes-256-gcm', keyBuffer, iv);
    const decrypted = Buffer.concat([
      cipher.update(cipherText),
      cipher.final(),
    ]);
    return decrypted.toJSON() as T;
  }
}
