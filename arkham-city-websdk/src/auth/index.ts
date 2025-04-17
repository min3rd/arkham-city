import { manager } from '../manager';

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
}

export const auth = (): Auth => {
  return Auth.instance;
};
