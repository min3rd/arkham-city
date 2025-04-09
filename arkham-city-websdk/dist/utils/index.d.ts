import { JwtPayload } from "jwt-decode";
export default class JwtUtils {
    static decodeJwt(token: string): JwtPayload;
    static isExpired(token: string): boolean;
}
