import { jwtDecode, JwtPayload } from 'jwt-decode';

export class AuthUtils {
  static decodeJwt(token: string): JwtPayload {
    return jwtDecode(token);
  }
  static isExpired(token: string): boolean {
    return (
      new Date().valueOf() >
      new Date().setUTCSeconds(this.decodeJwt(token).exp ?? 0).valueOf()
    );
  }
}
