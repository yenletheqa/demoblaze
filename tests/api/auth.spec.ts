import { test, expect } from '@fixtures/apis.fixture'
import { extractAuthToken } from '@utils/api.utils';

type CheckReponse = {
    Item: {
        expiration: number,
        token: string,
        username: string
    }
}

test.describe('API: Authentication Flow', () => {

    test('API login and token validation succeed for correct credentials', async ({ authController }) => {
        expect(process.env.USERNAME).toBeDefined();
        expect(process.env.PASSWORD).toBeDefined();

        const loginRes = await authController.login(process.env.USERNAME!, process.env.PASSWORD!);

        expect(loginRes.status()).toBe(200);

        const raw = await loginRes.text();
        const token = extractAuthToken(raw);;
        expect(token).toBeDefined();

        const checkRes = await authController.check(token);
        expect(checkRes.status()).toBe(200);


        const checkBody = await checkRes.json() as CheckReponse;
        const item = checkBody.Item;

        expect(typeof item.expiration).toBe('number');
        expect(item.token).toEqual(token);
        expect(item.username).toEqual(process.env.USERNAME);
    });
});