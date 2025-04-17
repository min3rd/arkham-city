"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.Auth = void 0;
const manager_1 = require("../manager");
class Auth {
    static get instance() {
        if (!this._instance) {
            this._instance = new Auth();
        }
        return this._instance;
    }
    constructor() { }
    registerByEmailAndPassword(email, password) {
        return (0, manager_1.manager)().post(`auth/register-by-email-and-password`, {
            email: email,
            password: password,
        });
    }
}
exports.Auth = Auth;
const auth = () => {
    return Auth.instance;
};
exports.auth = auth;
