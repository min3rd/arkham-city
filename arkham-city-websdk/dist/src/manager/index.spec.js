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
describe('Ark Manager', () => {
    (0, _1.globalConfig)({
        url: 'http://localhost:3000',
        version: 'v1',
        projectId: '67f5c8217c6825c085fbbeef',
        appId: '67f5c8337c6825c085fbbef3',
        secretKey: 'VpkrHWRgqtwU51W3K2NGa3yKp4kjbpRzcE3hdxIat1YhbzE3eeR4lI71ETDW8Z9L',
    });
    test('Ark Manager:endpoint', () => {
        const uri = 'authenticate';
        const expected = `${(0, _1.manager)().globalConfig.url}/${(0, _1.manager)().globalConfig.version}/${(0, _1.manager)().type}/${uri}`;
        const returned = (0, _1.manager)().endpoint(uri);
        expect(returned).toEqual(expected);
    });
    test('Ark Manager:authenticate', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, rxjs_1.firstValueFrom)((0, _1.manager)().authenticate());
        expect(res).toBeDefined();
    }));
});
