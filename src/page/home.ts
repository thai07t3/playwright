import type { Locator, Page } from "@playwright/test";

export class HomePage {
    readonly page: Page;
    readonly closeButton: Locator;
    readonly loginLink: Locator;
    readonly allDepartmentsLabel: Locator;
    // readonly cartLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.closeButton = this.page.getByRole('button', { name: 'Close' });
        this.loginLink = this.page.getByRole('link', { name: 'Log in / Sign up' });
        this.allDepartmentsLabel = this.page.getByText('All Departments');
        // this.cartLink = this.page.getByRole('link', { name: 'Cart' });
    }

    async closePopupIfPresent() {
        await this.closeButton.click({ timeout: 5000 });
    }

    async navigateToLogin() {
        await this.loginLink.click();
    }

    // async navigateToCart() {
    //     await this.cartLink.click();
    // }

    async selectDepartment(departmentName: string) {
        await this.allDepartmentsLabel.hover();
        const departmentLink = this.page.locator('.item-link')
            .filter({ hasText: departmentName })
            .first();
        await departmentLink.click();
    }
}