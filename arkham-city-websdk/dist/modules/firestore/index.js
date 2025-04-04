"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.firestore = void 0;
const config_1 = require("../config");
const httpClient_1 = __importDefault(require("../httpClient"));
class FirestoreClient {
    constructor() {
        this._arkSDKManager = config_1.arkSDKManager;
        this._httpClient = new httpClient_1.default();
    }
    static instance(schemaName) {
        if (!this._instance) {
            this._instance = new FirestoreClient();
        }
        this._instance._schemaName = schemaName;
        return this._instance;
    }
    new(data) {
        return this._httpClient.post(this._arkSDKManager.endpoint(`/firestore/${this._schemaName}`), data);
    }
}
exports.default = FirestoreClient;
const firestore = (schemaName) => {
    return FirestoreClient.instance(schemaName);
};
exports.firestore = firestore;
