import axios, { AxiosRequestConfig, AxiosResponse, AxiosStatic } from 'axios';
import { catchError, from, Observable, of, switchMap } from 'rxjs';
import JwtUtils from '../utils';
import { crypto } from '../crypto';

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

export class SDKManager {
  private _type: 'websdk' | 'mobilesdk' = 'websdk';
  private _accessToken!: string;
  private _globalConfig: SDKConfig = {
    url: 'http://localhost:3000',
    version: 'v1',
    projectId: '',
    appId: '',
    secretKey: '',
    isProductionMode: true,
  };
  private _axios: AxiosStatic = axios;
  private static _instance: SDKManager;
  constructor() {
    axios.interceptors.request.use(
      (config) => {
        if (this.globalConfig.isProductionMode) {
          config.headers.set('x-type', this.type);
          config.headers.set('x-mode', 'production');
          config.headers.set('x-project', this.globalConfig.projectId);
          config.headers.set('x-app', this.globalConfig.appId);
        } else {
          config.headers.set('x-mode', 'development');
        }
        if (this.accessToken) {
          config.headers.setAuthorization(`Bearer ${this.accessToken}`);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );
  }
  public static get instance() {
    if (!this._instance) {
      this._instance = new SDKManager();
    }
    return this._instance;
  }

  set globalConfig(config: SDKConfig) {
    this._globalConfig = config;
  }
  set accessToken(accessToken: string) {
    this._accessToken = accessToken;
  }
  get globalConfig(): SDKConfig {
    return this._globalConfig;
  }
  get type(): 'websdk' | 'mobilesdk' {
    return this._type;
  }
  get accessToken(): string {
    return this._accessToken;
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
    let encrypted!: any;
    if (this.globalConfig.isProductionMode) {
      encrypted = {
        data: crypto().encrypt(payload, this.globalConfig.projectId),
      };
    }
    return from(
      this._axios.post<any>(
        this.endpoint(`auth/authenticate`),
        this.globalConfig.isProductionMode ? encrypted : payload,
      ),
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
  post<T, K>(uri: string, data: T): Observable<K | null> {
    return this.check().pipe(
      switchMap((authenticated) => {
        if (!authenticated) {
          console.error('Unauthorization');
          return of(null);
        }
        let encrypted!: any;
        if (this.globalConfig.isProductionMode) {
          encrypted = {
            data: crypto().encrypt(data, this.globalConfig.projectId),
          };
        }
        return from(
          this._axios.post(
            this.endpoint(uri),
            this.globalConfig.isProductionMode ? encrypted : data,
          ),
        ).pipe(
          catchError(() => {
            return of(null);
          }),
          switchMap((response: AxiosResponse<ApiResponse<K>> | null) => {
            if (!response) {
              return of(null);
            }
            return of(response.data.data);
          }),
        );
      }),
    );
  }

  get<T>(uri: string): Observable<T | null> {
    return this.check().pipe(
      switchMap((authenticated) => {
        if (!authenticated) {
          console.error('Unauthorization');
          return of(null);
        }
        return from(this._axios.get(this.endpoint(uri))).pipe(
          catchError(() => {
            return of(null);
          }),
          switchMap((response: AxiosResponse<ApiResponse<T>> | null) => {
            if (!response) {
              return of(null);
            }
            return of(response.data.data);
          }),
        );
      }),
    );
  }

  put<T, K>(uri: string, data: T): Observable<K | null> {
    return this.check().pipe(
      switchMap((autthenticated) => {
        if (!autthenticated) {
          console.error('Unauthorization');
          return of(null);
        }
        let encrypted!: any;
        if (this.globalConfig.isProductionMode) {
          encrypted = {
            data: crypto().encrypt(data, this.globalConfig.projectId),
          };
        }
        return from(
          this._axios.put(
            this.endpoint(uri),
            this.globalConfig.isProductionMode ? encrypted : data,
          ),
        ).pipe(
          catchError(() => {
            return of(null);
          }),
          switchMap((response: AxiosResponse<ApiResponse<K>> | null) => {
            if (!response) {
              return of(null);
            }
            return of(response.data.data);
          }),
        );
      }),
    );
  }

  patch<T, K>(uri: string, data: T): Observable<K | null> {
    return this.check().pipe(
      switchMap((autthenticated) => {
        if (!autthenticated) {
          console.error('Unauthorization');
          return of(null);
        }
        let encrypted!: any;
        if (this.globalConfig.isProductionMode) {
          encrypted = {
            data: crypto().encrypt(data, this.globalConfig.projectId),
          };
        }
        return from(
          this._axios.patch(
            this.endpoint(uri),
            this.globalConfig.isProductionMode ? encrypted : data,
          ),
        ).pipe(
          catchError(() => {
            return of(null);
          }),
          switchMap((response: AxiosResponse<ApiResponse<K>> | null) => {
            if (!response) {
              return of(null);
            }
            return of(response.data.data);
          }),
        );
      }),
    );
  }

  delete<T>(uri: string): Observable<T | null> {
    return this.check().pipe(
      switchMap((authenticated) => {
        if (!authenticated) {
          console.error('Unauthorization');
          return of(null);
        }
        return from(this._axios.delete(this.endpoint(uri))).pipe(
          catchError(() => {
            return of(null);
          }),
          switchMap((response: AxiosResponse<ApiResponse<T>> | null) => {
            if (!response) {
              return of(null);
            }
            return of(response.data.data);
          }),
        );
      }),
    );
  }
}

export const manager = () => {
  return SDKManager.instance;
};

export const globalConfig = (config: SDKConfig) => {
  manager().globalConfig = {
    ...manager().globalConfig,
    ...config,
  };
};
