import type { Locator, Page } from "@playwright/test";

export class ProductPage {
    readonly page: Page;
    readonly gridViewLink: Locator;
    readonly listViewLink: Locator;
    readonly items: Locator;

    constructor(page: Page) {
        this.page = page;
        this.items = this.page.locator('div.content-product');
        this.gridViewLink = this.page.locator('.switch-grid');
        this.listViewLink = this.page.locator('.switch-list');
    }

    async selectItem() {
        const randomIndex = Math.floor(Math.random() * await this.items.count());
        await this.items.nth(randomIndex).click();
    }

    async switchToGridView() {
        await this.gridViewLink.click();
    }

    async switchToListView() {
        await this.listViewLink.click();
    }
}