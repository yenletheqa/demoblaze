import { test as base } from '@playwright/test';
import { HomePage, LoginPage } from '@pages';

type Pages = {
  homePage: HomePage;
  loginPage: LoginPage;
};

export const test = base.extend<Pages>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

export { expect } from '@playwright/test';