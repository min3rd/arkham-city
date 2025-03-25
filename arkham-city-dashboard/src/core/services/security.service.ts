import { Injectable } from '@angular/core';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { AES } from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  private readonly PRIVATE_KEY: string = 'Ohhhh shit!!! Here we go again!!!';
  private readonly SALT_ROUND: number = 69;
  constructor() {}
  hash<T>(data: T) {
    const salt = genSaltSync(this.SALT_ROUND);
    return hashSync(JSON.stringify(data), salt);
  }
  compare<T>(target: T, source: string): boolean {
    return compareSync(JSON.stringify(target), source);
  }
  encrypt<T>(data: T): string {
    return AES.encrypt(JSON.stringify(data), this.PRIVATE_KEY).toString();
  }
  decrypt<T>(encrypted: string): string | T {
    const decrypted = AES.decrypt(encrypted, this.PRIVATE_KEY).toString(
      CryptoJS.enc.Utf8
    );
    try {
      const data = JSON.parse(decrypted);
      return data;
    } catch (e) {
      return decrypted;
    }
  }
}
