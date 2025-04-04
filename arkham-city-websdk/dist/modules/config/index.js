"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalConfig = exports.arkSDKManager = exports.ArkSDKManager = void 0;
class ArkSDKManager {
    set globalConfig(config) {
        this._globalConfig = config;
    }
    set accessToken(accessToken) {
        this.accessToken = accessToken;
    }
    set refreshToken(refreshToken) {
        this._refreshToken = refreshToken;
    }
    get globalConfig() {
        return this._globalConfig;
    }
    axiosConfig() {
        return {
            headers: {
                Authorization: `Bearer ${this._accessToken}`,
            },
        };
    }
    endpoint(uri) {
        while (this._globalConfig.url.endsWith('/')) {
            this._globalConfig.url = this._globalConfig.url.substring(0, this._globalConfig.url.lastIndexOf('/') - 1);
        }
        while (this._globalConfig.version.startsWith('/')) {
            this._globalConfig.version = this._globalConfig.version.substring(this._globalConfig.version.indexOf('/'));
        }
        let safeUri = uri;
        while (safeUri.startsWith('/')) {
            safeUri = safeUri.substring(safeUri.indexOf('/'));
        }
        return `${this._globalConfig.url}/${this.globalConfig.version}/${safeUri}`;
    }
}
exports.ArkSDKManager = ArkSDKManager;
exports.arkSDKManager = new ArkSDKManager();
const globalConfig = (config) => {
    exports.arkSDKManager.globalConfig = config;
};
exports.globalConfig = globalConfig;
