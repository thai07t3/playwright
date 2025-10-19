import type { Locator, Page } from "@playwright/test";

export class HomePage {
    readonly page: Page;
    readonly loginLink: Locator;
    // readonly cartLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.loginLink = this.page.getByRole('link', { name: 'Log in / Sign up' });
        // this.cartLink = this.page.getByRole('link', { name: 'Cart' });
    }

    async navigateToLogin() {
        await this.loginLink.click();
    }

    // async navigateToCart() {
    //     await this.cartLink.click();
    // }

    async selectDepartment(departmentName: string) {
        const departmentLink = this.page.getByRole('link', { name: departmentName });
        await departmentLink.click();
    }
}