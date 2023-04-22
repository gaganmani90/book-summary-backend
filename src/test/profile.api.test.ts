// @ts-ignore
import {request} from "supertest";
import {app} from "../index";


describe.skip('Profile CRUD API', () => {

    it('should retrieve the created profile', async () => {
        const res = await request(app).get(`/profile`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.email).toEqual('test@example.com');
        expect(res.body.age).toEqual(25);
        expect(res.body.gender).toEqual('Male');
    });

});
