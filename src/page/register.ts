import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "./base.ts";

export class RegisterPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly registerButton: Locator;
  readonly emailInputLogin: Locator;
  readonly passwordInputLogin: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = this.page.getByRole("textbox", {
      name: "Email address *",
      exact: true,
    });
    this.passwordInput = this.page.getByTestId("reg_password");
    this.registerButton = this.page.getByRole("button", { name: "Register" });
    this.emailInputLogin = this.page.getByRole("textbox", {
      name: "Username or email address *",
    });
    this.passwordInputLogin = this.page.getByTestId("password");
    this.loginButton = this.page.getByRole("button", { name: "Login" });
  }

  async register(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.registerButton.dispatchEvent("click");
  }

  async login(email: string, password: string) {
    await this.emailInputLogin.fill(email);
    await this.passwordInputLogin.fill(password);
    await this.loginButton.dispatchEvent("click");
  }
}
