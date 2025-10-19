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

    async fillUsername(username: string) {
        await this.usernameInput.fill(username);
    }

    async fillPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    async login(username: string, password: string, clear: boolean = false) {
        if (clear) {
            await this.fillUsername('');
            await this.fillPassword('');
        }
        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.loginButton.click();
    }
}