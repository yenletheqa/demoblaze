import { test, expect } from '@fixtures/pages.fixture';

test.describe('@auth UI: Authentication – Login', () => {

  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
    await homePage.openLoginModal();
  });

  test('Login succeeds when valid credentials are provided', async ({ homePage, loginPage }) => {
    await loginPage.login(process.env.USERNAME!, process.env.PASSWORD!);

    await expect(homePage.welcomeText, 'Welcome message should be displayed').toBeVisible();
    await expect(homePage.welcomeText, 'Welcome message should include username').toHaveText(
      `Welcome ${process.env.USERNAME}`
    );
  });

  test('Login shows validation error when credentials are missing', async ({ homePage, loginPage }) => {
    const message = await loginPage.loginWithInvalidData();
    expect(message, 'Alert message should match').toEqual('Please fill out Username and Password.');
  });
});
