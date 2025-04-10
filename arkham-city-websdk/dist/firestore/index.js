"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firestore = void 0;
const manager_1 = require("../manager");
class FirestoreClient {
    static instance(schemaName) {
        if (!this._instance) {
            this._instance = new FirestoreClient();
        }
        this._instance._schemaName = schemaName;
        return this._instance;
    }
    get schemaName() {
        return this._schemaName;
    }
    create(data) {
        return (0, manager_1.manager)().post(`firestore/${this._schemaName}`, data);
    }
    select(query) {
        return (0, manager_1.manager)().post(`firestore/${this._schemaName}/query`, query);
    }
    get(id) {
        return (0, manager_1.manager)().get(`firestore/${this._schemaName}/${id}`);
    }
    partialUpdate(id, data) {
        return (0, manager_1.manager)().patch(`firestore/${this._schemaName}/${id}`, data);
    }
    update(id, data) {
        return (0, manager_1.manager)().put(`firestore/${this._schemaName}/${id}`, data);
    }
    delete(id) {
        return (0, manager_1.manager)().delete(`firestore/${this._schemaName}/${id}`);
    }
}
exports.default = FirestoreClient;
const firestore = (schemaName) => {
    return FirestoreClient.instance(schemaName);
};
exports.firestore = firestore;
