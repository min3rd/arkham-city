"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
class HttpClient {
    set config(config) {
        this._config = config;
    }
    get(url) {
        return (0, rxjs_1.from)(this.axios.get(url, this._config));
    }
    post(url, data) {
        return (0, rxjs_1.from)(this.axios.post(url, data, this.config));
    }
    put(url, data) {
        return (0, rxjs_1.from)(this.axios.put(url, data, this.config));
    }
    patch(url, data) {
        return (0, rxjs_1.from)(this.axios.patch(url, data, this.config));
    }
    delete(url) {
        return (0, rxjs_1.from)(this.axios.delete(url, this.config));
    }
}
exports.default = HttpClient;
