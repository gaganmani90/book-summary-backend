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
// @ts-ignore
const supertest_1 = require("supertest");
const src_1 = require("../src");
describe.skip('Profile CRUD API', () => {
    it('should retrieve the created profile', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.request)(src_1.app).get(`/profile`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.email).toEqual('test@example.com');
        expect(res.body.age).toEqual(25);
        expect(res.body.gender).toEqual('Male');
    }));
});
