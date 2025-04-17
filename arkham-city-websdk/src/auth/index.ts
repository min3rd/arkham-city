import { AuthResDto, manager } from '../manager';
import { tap } from 'rxjs';

export class Auth {
  private static _instance: Auth;
  public static get instance(): Auth {
    if (!this._instance) {
      this._instance = new Auth();
    }
    return this._instance;
  }
  constructor() {}
  registerByEmailAndPassword(email: string, password: string) {
    return manager().post(`auth/register-by-email-and-password`, {
      email: email,
      password: password,
    });
  }

  logInByEmailAndPassword(email: string, password: string) {
    return manager().post<any, AuthResDto>(`auth/log-in-by-email-and-password`, {
      email: email,
      password: password,
    }).pipe(tap(res => {
      if(res?.accessToken){
        manager().accessToken = res.accessToken
      }
    }));
  }
}

export const auth = (): Auth => {
  return Auth.instance;
};
