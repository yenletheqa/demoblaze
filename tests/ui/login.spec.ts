import { test, expect } from '@fixtures/pages.fixture'

test.describe('UI: Authentication – Login', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
    await homePage.openLoginModal();
  });

  test('Login succeeds when valid credentials are provided', async ({ homePage, loginPage }) => {
    await loginPage.login(process.env.USERNAME, process.env.PASSWORD);

    await expect(homePage.welcomeText).toBeVisible();
    await expect(homePage.welcomeText).toHaveText(`Welcome ${process.env.USERNAME}`);
  });

  test('Login shows validation error when credentials are missing', async ({ loginPage }) => {
    const message = await loginPage.loginWithInvalidData();
    expect(message).toEqual("Please fill out Username and Password.");
  });
});