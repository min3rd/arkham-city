import axios, { AxiosRequestConfig, AxiosResponse, AxiosStatic } from "axios";
import { from, Observable, of, switchMap } from "rxjs";

export interface ArkSDKConfig {
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

export class ArkSDKManager {
  private _type: "websdk" = "websdk";
  private _accessToken!: string;
  private _refreshToken!: string;
  private _globalConfig!: ArkSDKConfig;
  private _axios: AxiosStatic = axios;
  set globalConfig(config: ArkSDKConfig) {
    const tmp: ArkSDKConfig = {
      ...config,
      version: config.version ?? "v1",
    };
    this._globalConfig = tmp;
  }
  set accessToken(accessToken: string) {
    this.accessToken = accessToken;
  }
  set refreshToken(refreshToken: string) {
    this._refreshToken = refreshToken;
  }
  get globalConfig(): ArkSDKConfig {
    return this._globalConfig;
  }
  get type(): "websdk" | string {
    return this._type;
  }
  axiosConfig(): AxiosRequestConfig {
    return {
      headers: {
        Authorization: `Bearer ${this._accessToken}`,
      },
    };
  }
  endpoint(uri: string): string {
    return `${this.globalConfig.url}/${this.globalConfig.version}/${this.type}/${uri}`;
  }
  authenticate(): Observable<AuthResDto> {
    const payload: AuthReqDto = {
      projectId: this.globalConfig.projectId,
      appId: this.globalConfig.appId,
      secretKey: this.globalConfig.secretKey,
      auth: undefined,
    };
    return from(
      this._axios.post(this.endpoint(`auth/authenticate`), payload)
    ).pipe(
      switchMap((response: AxiosResponse<AuthResDto>) => {
        return of(response.data);
      })
    );
  }
  post<T, K>(uri: string, data: T): Observable<AxiosResponse<K>> {
    return from(this._axios.post<K>(this.endpoint(uri), data));
  }
}

export const arkSDKManager = new ArkSDKManager();

export const globalConfig = (config: ArkSDKConfig) => {
  arkSDKManager.globalConfig = config;
};
