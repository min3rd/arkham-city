export declare class CryptoService {
    private static _instance;
    static get instance(): CryptoService;
    encrypt<T>(value: T, key: string): string;
    decrypt<T>(encrypted: string, key: string): T | null;
}
export declare const crypto: () => CryptoService;
