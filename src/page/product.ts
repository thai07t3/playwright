import type { Locator, Page } from "@playwright/test";

export class ProductPage {
    readonly page: Page;
    readonly items: Locator;

    constructor(page: Page) {
        this.page = page;
        this.items = this.page.locator('div.content-product');
    }

    async selectItem() {
        const randomIndex = Math.floor(Math.random() * await this.items.count());
        await this.items.nth(randomIndex).click();
    }
}