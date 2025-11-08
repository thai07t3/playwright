import { expect, type Locator, type Page } from "@playwright/test";
import { BasePage } from "./base.ts";
import { Menu } from "../type/menu.type.ts";

export class AccountPage extends BasePage   {
    readonly logoutLink: Locator;

    constructor(page: Page) {
        super(page);
        this.logoutLink = this.page.getByRole('link', { name: 'Logout' });
    }

    async shouldMyAccountPageDisplay(username: string) {
        await expect(this.page).toHaveURL(/.*my-account/);
        await this.shouldBeOnPage(Menu.MY_ACCOUNT);
        await expect(this.page.getByText(`Hello ${username} (not ${username}? Sign out)`)).toBeVisible();
        await this.shouldLogoutLinkBeVisible();
    }

    async shouldLogoutLinkBeVisible() {
        await expect(this.logoutLink).toBeVisible();
    }

    async logout() {
        await this.logoutLink.click();
    }
}