import axios, { AxiosRequestConfig, AxiosStatic } from 'axios';
import { catchError, from, Observable, of, switchMap } from 'rxjs';
import { JwtUtils } from '../utils';

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

export interface ApiResponse<T> {
  timestamp: Date;
  error: boolean;
  data: T;
}

export class ArkSDKManager {
  private _type: 'websdk' = 'websdk';
  private _accessToken!: string;
  private _globalConfig!: ArkSDKConfig;
  private _axios: AxiosStatic = axios;
  private static _instance: ArkSDKManager;

  public static get instance() {
    if (!this._instance) {
      this._instance = new ArkSDKManager();
    }
    return this._instance;
  }

  set globalConfig(config: ArkSDKConfig) {
    const tmp: ArkSDKConfig = {
      ...config,
      version: config.version ?? 'v1',
    };
    this._globalConfig = tmp;
  }
  set accessToken(accessToken: string) {
    this._accessToken = accessToken;
  }
  get globalConfig(): ArkSDKConfig {
    return this._globalConfig;
  }
  get type(): 'websdk' | string {
    return this._type;
  }
  get accessToken(): string {
    return this._accessToken;
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
  authenticate(): Observable<boolean> {
    const payload: AuthReqDto = {
      projectId: this.globalConfig.projectId,
      appId: this.globalConfig.appId,
      secretKey: this.globalConfig.secretKey,
      auth: undefined,
    };
    return from(
      this._axios.post<any>(this.endpoint(`auth/authenticate`), payload),
    ).pipe(
      catchError((e) => {
        console.error(`Could not authenticate e=${e}`);
        return of(false);
      }),
      switchMap((response: any) => {
        if (response.data.data.accessToken) {
          this.accessToken = response.data.data.accessToken;
          return of(true);
        }
        return of(false);
      }),
    );
  }
  check(): Observable<boolean> {
    if (this.accessToken && !JwtUtils.isExpired(this.accessToken)) {
      return of(true);
    }
    return this.authenticate();
  }
  post<T, K>(uri: string, data: T): Observable<ApiResponse<K>> {
    return this.check().pipe(
      switchMap((authenticated) => {
        if (!authenticated) {
          console.error('Unauthorization');
          return of(null);
        }
        return from(
          this._axios.post(this.endpoint(uri), data, this.axiosConfig()),
        ).pipe(
          catchError((e) => {
            const resDto: ApiResponse<string> = {
              error: true,
              timestamp: new Date(),
              data: e,
            };
            return of(resDto);
          }),
          switchMap((response) => {
            return of(response.data);
          }),
        );
      }),
    );
  }

  get<T>(uri: string): Observable<ApiResponse<T>> {
    return this.check().pipe(
      switchMap((authenticated) => {
        if (!authenticated) {
          console.error('Unauthorization');
          return of(null);
        }
        return from(
          this._axios.get(this.endpoint(uri), this.axiosConfig()),
        ).pipe(
          catchError((e) => {
            const resDto: ApiResponse<string> = {
              error: true,
              timestamp: new Date(),
              data: e,
            };
            return of(resDto);
          }),
          switchMap((response) => {
            return of(response.data);
          }),
        );
      }),
    );
  }
}

export const arkSDKManager = () => {
  return ArkSDKManager.instance;
};

export const globalConfig = (config: ArkSDKConfig) => {
  arkSDKManager().globalConfig = config;
};
