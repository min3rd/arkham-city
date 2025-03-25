import { Injectable } from '@angular/core';
import { AES, enc } from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  private readonly PRIVATE_KEY: string = 'Ohhhh shit!!! Here we go again!!!';
  constructor() {}
  encrypt<T>(data: T): string {
    return AES.encrypt(JSON.stringify(data), this.PRIVATE_KEY).toString();
  }
  decrypt<T>(encrypted: string): string | T {
    const decrypted = AES.decrypt(encrypted, this.PRIVATE_KEY).toString(
      enc.Utf8
    );
    try {
      const data = JSON.parse(decrypted);
      return data;
    } catch (e) {
      return decrypted;
    }
  }
}
