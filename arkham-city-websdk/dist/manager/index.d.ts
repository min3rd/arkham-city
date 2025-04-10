import { Observable } from 'rxjs';
export interface SDKConfig {
    url: string;
    version: string;
    projectId: string;
    appId: string;
    secretKey: string;
    isProductionMode?: boolean;
}
export interface AuthReqDto {
    projectId: string;
    appId: string;
    secretKey: string;
    auth?: string;
}
export interface AuthResDto {
    accessToken: string;
}
export interface ApiResponse<T> {
    timestamp: Date;
    error: boolean;
    data: T;
}
export declare class SDKManager {
    private _type;
    private _accessToken;
    private _globalConfig;
    private _axios;
    private static _instance;
    constructor();
    static get instance(): SDKManager;
    set globalConfig(config: SDKConfig);
    set accessToken(accessToken: string);
    get globalConfig(): SDKConfig;
    get type(): 'websdk' | 'mobilesdk';
    get accessToken(): string;
    endpoint(uri: string): string;
    authenticate(): Observable<boolean>;
    check(): Observable<boolean>;
    post<T, K>(uri: string, data: T): Observable<K | null>;
    get<T>(uri: string): Observable<T | null>;
}
export declare const manager: () => SDKManager;
export declare const globalConfig: (config: SDKConfig) => void;
