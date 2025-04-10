"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crypto = exports.CryptoService = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
class CryptoService {
    static get instance() {
        if (!this._instance) {
            this._instance = new CryptoService();
        }
        return this._instance;
    }
    encrypt(value, key) {
        return crypto_js_1.default.AES.encrypt(JSON.stringify(value), key).toString();
    }
    decrypt(encrypted, key) {
        const decrypted = crypto_js_1.default.AES.decrypt(encrypted, key).toString(crypto_js_1.default.enc.Utf8);
        try {
            return JSON.parse(decrypted);
        }
        catch (e) {
            console.error(e);
            return null;
        }
    }
}
exports.CryptoService = CryptoService;
const crypto = () => {
    return CryptoService.instance;
};
exports.crypto = crypto;
