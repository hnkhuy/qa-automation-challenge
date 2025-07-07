import { Page } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly usernameInput;
    readonly passwordInput;
    readonly loginButton;
    readonly errorMessage;
    readonly inputErrorMessage;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = this.page.getByPlaceholder('Username');
        this.passwordInput = this.page.getByPlaceholder('Password');
        this.loginButton = this.page.locator('.orangehrm-login-button');
        this.errorMessage = this.page.locator('.oxd-alert-content-text');
        this.inputErrorMessage = this.page.locator('.oxd-input-group__message');
    }

    async navigate() {
        await this.page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    }

    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async getErrorMessage() {
        return await this.errorMessage.textContent();
    }

    async getInputErrorMessage(index: number) {
        return await this.inputErrorMessage.nth(index).textContent();
    }
}
