import type { Locator, Page } from "@playwright/test";
import { HomePage } from "./home.ts";

export class LoginPage extends HomePage {
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        super(page);
        this.usernameInput = this.page.getByRole('textbox', { name: 'Username or email address' });
        this.passwordInput = this.page.getByRole('textbox', { name: 'Password' });
        this.loginButton = this.page.getByRole('button', { name: 'Log in' });
    }

    async login(username: string, password: string, clear: boolean = true) {
        if (clear) {
            await this.usernameInput.fill('');
            await this.passwordInput.fill('');
        }
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}