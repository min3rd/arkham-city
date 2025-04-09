"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_decode_1 = require("jwt-decode");
class JwtUtils {
    static decodeJwt(token) {
        return (0, jwt_decode_1.jwtDecode)(token);
    }
    static isExpired(token) {
        var _a;
        return new Date() > new Date(((_a = this.decodeJwt(token)) === null || _a === void 0 ? void 0 : _a.exp) * 1000);
    }
}
exports.default = JwtUtils;
