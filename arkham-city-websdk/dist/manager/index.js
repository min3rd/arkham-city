"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalConfig = exports.manager = exports.SDKManager = void 0;
const axios_1 = __importDefault(require("axios"));
const rxjs_1 = require("rxjs");
const utils_1 = __importDefault(require("../utils"));
class SDKManager {
    constructor() {
        this._type = "websdk";
        this._globalConfig = {
            url: "http://localhost:3000",
            version: "v1",
            projectId: "",
            appId: "",
            secretKey: "",
            isProductionMode: false,
        };
        this._axios = axios_1.default;
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
    axiosConfig() {
        return {
            headers: {
                Authorization: `Bearer ${this._accessToken}`,
            },
        };
    }
    endpoint(uri) {
        return `${this.globalConfig.url}/${this.globalConfig.version}/${this.type}/${uri}`;
    }
    authenticate() {
        const payload = {
            projectId: this.globalConfig.projectId,
            appId: this.globalConfig.appId,
            secretKey: this.globalConfig.secretKey,
            auth: undefined,
        };
        return (0, rxjs_1.from)(this._axios.post(this.endpoint(`auth/authenticate`), payload)).pipe((0, rxjs_1.catchError)((e) => {
            console.error(`Could not authenticate e=${e}`);
            return (0, rxjs_1.of)(false);
        }), (0, rxjs_1.switchMap)((response) => {
            if (response.data.data.accessToken) {
                this.accessToken = response.data.data.accessToken;
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
                console.error("Unauthorization");
                return (0, rxjs_1.of)(null);
            }
            return (0, rxjs_1.from)(this._axios.post(this.endpoint(uri), data, this.axiosConfig())).pipe((0, rxjs_1.catchError)((e) => {
                const resDto = {
                    error: true,
                    timestamp: new Date(),
                    data: e,
                };
                return (0, rxjs_1.of)(resDto);
            }), (0, rxjs_1.switchMap)((response) => {
                return (0, rxjs_1.of)(response.data);
            }));
        }));
    }
    get(uri) {
        return this.check().pipe((0, rxjs_1.switchMap)((authenticated) => {
            if (!authenticated) {
                console.error("Unauthorization");
                return (0, rxjs_1.of)(null);
            }
            return (0, rxjs_1.from)(this._axios.get(this.endpoint(uri), this.axiosConfig())).pipe((0, rxjs_1.catchError)((e) => {
                const resDto = {
                    error: true,
                    timestamp: new Date(),
                    data: e,
                };
                return (0, rxjs_1.of)(resDto);
            }), (0, rxjs_1.switchMap)((response) => {
                return (0, rxjs_1.of)(response.data);
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
    (0, exports.manager)().globalConfig = config;
};
exports.globalConfig = globalConfig;
