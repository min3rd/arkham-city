import { jwtDecode, JwtPayload } from "jwt-decode";

export class JwtUtils {
  static decodeJwt(token: string): JwtPayload {
    return jwtDecode(token);
  }
  static isExpired(token: string): boolean {
    return new Date() > new Date((this.decodeJwt(token)?.exp as number) * 1000);
  }
}
