import { AuthResDto } from '../manager';
export declare class Auth {
    private static _instance;
    static get instance(): Auth;
    constructor();
    registerByEmailAndPassword(email: string, password: string): import("rxjs").Observable<unknown>;
    logInByEmailAndPassword(email: string, password: string): import("rxjs").Observable<AuthResDto | null>;
}
export declare const auth: () => Auth;
