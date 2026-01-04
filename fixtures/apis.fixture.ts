import { test as base, request, APIRequestContext } from '@playwright/test';
import { AuthController, ProductController } from '@apis';

type APIFixtures = {
  apiContext: APIRequestContext;
  authController: AuthController;
  productController: ProductController;
};

export const test = base.extend<APIFixtures>({
  apiContext: async ({}, use) => {
    const apiContext = await request.newContext({
      baseURL: process.env.API_BASE_PATH || 'https://api.demoblaze.com',
      extraHTTPHeaders: {
        Accept: '*/*',
        'Content-Type': 'application/json',
      },
    });

    await use(apiContext);
    await apiContext.dispose();
  },

  authController: async ({ apiContext }, use) => {
    await use(new AuthController(apiContext));
  },

  productController: async ({ apiContext }, use) => {
    await use(new ProductController(apiContext));
  },
});

export { expect } from '@playwright/test';