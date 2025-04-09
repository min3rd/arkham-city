"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const _1 = require(".");
const manager_1 = require("../manager");
describe('Firestore Client', () => {
    (0, manager_1.globalConfig)({
        url: 'http://localhost:3000',
        version: 'v1',
        projectId: '67f5c8217c6825c085fbbeef',
        appId: '67f5c8337c6825c085fbbef3',
        secretKey: 'VpkrHWRgqtwU51W3K2NGa3yKp4kjbpRzcE3hdxIat1YhbzE3eeR4lI71ETDW8Z9L',
    });
    test('Firestore Client: firestore(schema)', () => {
        const testSchemaName = 'conversions';
        const returned = (0, _1.firestore)(testSchemaName);
        expect(returned).toBeDefined();
        expect(returned.schemaName).toEqual(testSchemaName);
    });
    test('Firestore Client: new', () => __awaiter(void 0, void 0, void 0, function* () {
        const payload = {
            filed1: 'This is field 1',
            children: [
                {
                    name: 'Daughter',
                },
                {
                    name: 'Son',
                },
            ],
            account: {
                name: 'Account name',
                email: 'email@email.com',
                balances: {
                    real: 50000,
                    demo: 10000000,
                },
            },
        };
        const response = yield (0, rxjs_1.firstValueFrom)((0, _1.firestore)('test').new(payload));
        expect(response).toBeDefined();
    }));
    test('Firestore Client: update dynamic schema', () => __awaiter(void 0, void 0, void 0, function* () {
        const payload = {
            field2: 'This is field2',
            emails: ['email0@email.com', 'email1@email.com'],
            data: {
                accounts: [
                    {
                        username: 'account1',
                    },
                    {
                        username: 'account2',
                    },
                ],
            },
        };
        const response = yield (0, rxjs_1.firstValueFrom)((0, _1.firestore)('test').new(payload));
        expect(response).toBeDefined();
    }));
    test('Firestore Client: query all schema', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, rxjs_1.firstValueFrom)((0, _1.firestore)('test').select({}));
        expect(response).toBeDefined();
    }));
    test('Firestore Client: query schema', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const random = Math.random();
        const payload = {
            key: `This is the key ${random}`,
        };
        const newResponse = yield (0, rxjs_1.firstValueFrom)((0, _1.firestore)('test').new(payload));
        expect(newResponse.data).toBeDefined();
        const response = yield (0, rxjs_1.firstValueFrom)((0, _1.firestore)('test').select({
            _id: (_a = newResponse === null || newResponse === void 0 ? void 0 : newResponse.data) === null || _a === void 0 ? void 0 : _a._id,
        }));
        console.log(response.data);
        expect(response.data).toBeDefined();
        expect(response.data.length).toBeGreaterThan(0);
    }));
});
