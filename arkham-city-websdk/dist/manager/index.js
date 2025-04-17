"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalConfig = exports.manager = exports.SDKManager = void 0;
const axios_1 = __importDefault(require("axios"));
const rxjs_1 = require("rxjs");
const utils_1 = __importDefault(require("../utils"));
const crypto_1 = require("../crypto");
class SDKManager {
    constructor() {
        this._type = 'websdk';
        this._globalConfig = {
            url: 'http://localhost:3000',
            version: 'v1',
            projectId: '',
            appId: '',
            secretKey: '',
            isProductionMode: true,
        };
        this._axios = axios_1.default;
        axios_1.default.interceptors.request.use((config) => {
            if (this.globalConfig.isProductionMode) {
                config.headers.set('x-type', this.type);
                config.headers.set('x-mode', 'production');
                config.headers.set('x-project', this.globalConfig.projectId);
                config.headers.set('x-app', this.globalConfig.appId);
            }
            else {
                config.headers.set('x-mode', 'development');
            }
            if (this.accessToken) {
                config.headers.setAuthorization(`Bearer ${this.accessToken}`);
            }
            return config;
        }, (error) => {
            return Promise.reject(error);
        });
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new SDKManager();
        }
        return this._instance;
    }
    set globalConfig(config) {
        this._globalConfig = config;
    }
    set accessToken(accessToken) {
        this._accessToken = accessToken;
    }
    get globalConfig() {
        return this._globalConfig;
    }
    get type() {
        return this._type;
    }
    get accessToken() {
        return this._accessToken;
    }
    endpoint(uri) {
        return `${this.globalConfig.url}/${this.globalConfig.version}/${this.type}/${uri}`;
    }
    authenticate() {
        const payload = {
            projectId: this.globalConfig.projectId,
            appId: this.globalConfig.appId,
            secretKey: this.globalConfig.secretKey,
        };
        let encrypted;
        if (this.globalConfig.isProductionMode) {
            encrypted = {
                data: (0, crypto_1.crypto)().encrypt(payload, this.globalConfig.projectId),
            };
        }
        return (0, rxjs_1.from)(this._axios.post(this.endpoint(`auth/authenticate`), this.globalConfig.isProductionMode ? encrypted : payload)).pipe((0, rxjs_1.catchError)((e) => {
            console.error(`authenticate: ${e}`);
            return (0, rxjs_1.of)(false);
        }), (0, rxjs_1.switchMap)((response) => {
            var _a, _b;
            if ((_a = response === null || response === void 0 ? void 0 : response.data.data) === null || _a === void 0 ? void 0 : _a.accessToken) {
                this.accessToken = (_b = response === null || response === void 0 ? void 0 : response.data.data) === null || _b === void 0 ? void 0 : _b.accessToken;
                return (0, rxjs_1.of)(true);
            }
            return (0, rxjs_1.of)(false);
        }));
    }
    check() {
        if (this.accessToken && !utils_1.default.isExpired(this.accessToken)) {
            return (0, rxjs_1.of)(true);
        }
        return this.authenticate();
    }
    post(uri, data) {
        return this.check().pipe((0, rxjs_1.switchMap)((authenticated) => {
            if (!authenticated) {
                console.error('Unauthorization');
                return (0, rxjs_1.of)(null);
            }
            let encrypted;
            if (this.globalConfig.isProductionMode) {
                encrypted = {
                    data: (0, crypto_1.crypto)().encrypt(data, this.globalConfig.projectId),
                };
            }
            return (0, rxjs_1.from)(this._axios.post(this.endpoint(uri), this.globalConfig.isProductionMode ? encrypted : data)).pipe((0, rxjs_1.catchError)(() => {
                return (0, rxjs_1.of)(null);
            }), (0, rxjs_1.switchMap)((response) => {
                if (!response || !response.data || response.data.error) {
                    return (0, rxjs_1.of)(null);
                }
                return (0, rxjs_1.of)(response.data.data);
            }));
        }));
    }
    get(uri) {
        return this.check().pipe((0, rxjs_1.switchMap)((authenticated) => {
            if (!authenticated) {
                console.error('Unauthorization');
                return (0, rxjs_1.of)(null);
            }
            return (0, rxjs_1.from)(this._axios.get(this.endpoint(uri))).pipe((0, rxjs_1.catchError)(() => {
                return (0, rxjs_1.of)(null);
            }), (0, rxjs_1.switchMap)((response) => {
                if (!response || !response.data || response.data.error) {
                    return (0, rxjs_1.of)(null);
                }
                return (0, rxjs_1.of)(response.data.data);
            }));
        }));
    }
    put(uri, data) {
        return this.check().pipe((0, rxjs_1.switchMap)((authenticated) => {
            if (!authenticated) {
                console.error('Unauthorization');
                return (0, rxjs_1.of)(null);
            }
            let encrypted;
            if (this.globalConfig.isProductionMode) {
                encrypted = {
                    data: (0, crypto_1.crypto)().encrypt(data, this.globalConfig.projectId),
                };
            }
            return (0, rxjs_1.from)(this._axios.put(this.endpoint(uri), this.globalConfig.isProductionMode ? encrypted : data)).pipe((0, rxjs_1.catchError)(() => {
                return (0, rxjs_1.of)(null);
            }), (0, rxjs_1.switchMap)((response) => {
                if (!response || !response.data || response.data.error) {
                    return (0, rxjs_1.of)(null);
                }
                return (0, rxjs_1.of)(response.data.data);
            }));
        }));
    }
    patch(uri, data) {
        return this.check().pipe((0, rxjs_1.switchMap)((autthenticated) => {
            if (!autthenticated) {
                console.error('Unauthorization');
                return (0, rxjs_1.of)(null);
            }
            let encrypted;
            if (this.globalConfig.isProductionMode) {
                encrypted = {
                    data: (0, crypto_1.crypto)().encrypt(data, this.globalConfig.projectId),
                };
            }
            return (0, rxjs_1.from)(this._axios.patch(this.endpoint(uri), this.globalConfig.isProductionMode ? encrypted : data)).pipe((0, rxjs_1.catchError)(() => {
                return (0, rxjs_1.of)(null);
            }), (0, rxjs_1.switchMap)((response) => {
                if (!response || !response.data || response.data.error) {
                    return (0, rxjs_1.of)(null);
                }
                return (0, rxjs_1.of)(response.data.data);
            }));
        }));
    }
    delete(uri) {
        return this.check().pipe((0, rxjs_1.switchMap)((authenticated) => {
            if (!authenticated) {
                console.error('Unauthorization');
                return (0, rxjs_1.of)(null);
            }
            return (0, rxjs_1.from)(this._axios.delete(this.endpoint(uri))).pipe((0, rxjs_1.catchError)(() => {
                return (0, rxjs_1.of)(null);
            }), (0, rxjs_1.switchMap)((response) => {
                if (!response || !response.data || response.data.error) {
                    return (0, rxjs_1.of)(null);
                }
                return (0, rxjs_1.of)(response.data.data);
            }));
        }));
    }
}
exports.SDKManager = SDKManager;
const manager = () => {
    return SDKManager.instance;
};
exports.manager = manager;
const globalConfig = (config) => {
    (0, exports.manager)().globalConfig = Object.assign(Object.assign({}, (0, exports.manager)().globalConfig), config);
};
exports.globalConfig = globalConfig;
