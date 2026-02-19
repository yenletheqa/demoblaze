import { test, expect } from '@fixtures/apis.fixture';
import { extractAuthToken } from '@utils/api.utils';
import type { CheckResponse } from '@types';

test.describe('@auth API: Authentication Flow', () => {

  test('API login and token validation succeed for correct credentials', async ({ authController }) => {
    expect(process.env.USERNAME).toBeDefined();
    expect(process.env.PASSWORD).toBeDefined();

    const loginRes = await authController.login(process.env.USERNAME!, process.env.PASSWORD!);

    expect(loginRes.status(), 'Login response status should be success').toBe(200);

    const raw = await loginRes.text();
    const token = extractAuthToken(raw);
    expect(token, 'Login response should contain token').toBeDefined();

    const checkRes = await authController.check(token);
    expect(checkRes.status(), 'Check response status should be success').toBe(200);

    const checkBody = (await checkRes.json()) as CheckResponse;
    const item = checkBody.Item;

    expect(typeof item.expiration, 'Expiration should be included and be a number').toBe('number');
    expect(item.token, 'Token should match').toEqual(token);
    expect(item.username, 'Username should match').toEqual(process.env.USERNAME);
  });
});
