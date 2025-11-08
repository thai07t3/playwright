import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "./base.ts";

export class RegisterPage extends BasePage {
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly registerButton: Locator;

    constructor(page: Page) {
        super(page);
        this.emailInput = this.page.getByRole('textbox', { name: 'Email address *', exact: true });
        this.passwordInput = this.page.getByTestId("reg_password");
        this.registerButton = this.page.getByRole('button', { name: 'Register' });
    }

    async register(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.registerButton.dispatchEvent('click');
    }
}
