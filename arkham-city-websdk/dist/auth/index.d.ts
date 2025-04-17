export declare class Auth {
    private static _instance;
    static get instance(): Auth;
    constructor();
    registerByEmailAndPassword(email: string, password: string): import("rxjs").Observable<unknown>;
}
export declare const auth: () => Auth;
