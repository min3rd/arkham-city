import { AxiosRequestConfig } from "axios";
import HttpClient from "../httpClient";

export default interface ArkSDKConfig {
  url: string;
  version: string;
  projectId: string;
  appId: string;
  secretKey: string;
  isProductionMode?: boolean;
}

export class ArkSDKManager {
  private _type: "websdk" = "websdk";
  private _accessToken!: string;
  private _refreshToken!: string;
  private _globalConfig!: ArkSDKConfig;
  private _httpClient: HttpClient = new HttpClient();
  set globalConfig(config: ArkSDKConfig) {
    const tmp: ArkSDKConfig = {
      ...config,
      version: config.version ?? "v1",
    };
    this._globalConfig = config;
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
    return `${this._globalConfig.url}/${this._globalConfig.version}/${this._type}/${uri}`;
  }
  authenticate() {
    this._httpClient.post(this.endpoint(`auth/authenticate`), {});
  }
}

export const arkSDKManager = new ArkSDKManager();

export const globalConfig = (config: ArkSDKConfig) => {
  arkSDKManager.globalConfig = config;
};
