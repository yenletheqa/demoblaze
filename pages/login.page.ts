import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;


  constructor(page: Page) {
    this.page = page;

    this.usernameInput = page.locator('#loginusername');
    this.passwordInput = page.locator('#loginpassword');
    this.loginButton = page.getByRole('button', { name: 'Log in' })
  }

  async login(username: string, password: string) {
    await this.enterCredentials(username, password);
    
    await this.loginButton.click();
  }

  async loginWithInvalidData(username?: string, password?: string): Promise<string> {
    let dialogMessage = '';

    this.page.once('dialog', async dialog => {
      dialogMessage = dialog.message();
      await dialog.dismiss().catch(() => { });
    });

    if (username || password) {
      await this.enterCredentials(username, password);
    }

    await this.loginButton.click();

    return dialogMessage;
  }

  private async enterCredentials(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
  }
}