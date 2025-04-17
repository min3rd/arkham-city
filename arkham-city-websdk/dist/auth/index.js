"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.Auth = void 0;
const manager_1 = require("../manager");
const rxjs_1 = require("rxjs");
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
    logInByEmailAndPassword(email, password) {
        return (0, manager_1.manager)().post(`auth/log-in-by-email-and-password`, {
            email: email,
            password: password,
        }).pipe((0, rxjs_1.tap)(res => {
            if (res === null || res === void 0 ? void 0 : res.accessToken) {
                (0, manager_1.manager)().accessToken = res.accessToken;
            }
        }));
    }
}
exports.Auth = Auth;
const auth = () => {
    return Auth.instance;
};
exports.auth = auth;
