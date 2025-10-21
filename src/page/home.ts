import type { Locator, Page } from "@playwright/test";
import type { AllDepartments } from "../type/all.deparments.ts";

export class HomePage {
    readonly page: Page;
    readonly closeButton: Locator;
    readonly loginLink: Locator;
    readonly allDepartmentsLabel: Locator;
    readonly cartLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.closeButton = this.page.getByRole('button', { name: 'Close' });
        this.loginLink = this.page.getByRole('link', { name: 'Log in / Sign up' });
        this.allDepartmentsLabel = this.page.getByText('All Departments');
        this.cartLink = this.page.locator(".cart-type1 svg").first();
    }

    async closePopupIfPresent() {
        await this.closeButton.click({ timeout: 5000 });
    }

    async goToLogin() {
        await this.loginLink.click();
    }

    async goToCart() {
        await this.cartLink.scrollIntoViewIfNeeded();
        await this.cartLink.click();
    }

    async selectDepartment(departmentName: AllDepartments) {
        await this.allDepartmentsLabel.hover();
        const departmentLink = this.page.locator('.item-link')
            .filter({ hasText: departmentName })
            .first();
        await departmentLink.scrollIntoViewIfNeeded();
        await departmentLink.click();
    }
}