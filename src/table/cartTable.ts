import { expect, type Locator, type Page } from "@playwright/test";

export class CartTable {
    readonly page: Page;
    readonly table: Locator;
    readonly tableBody: Locator;
    readonly cartItems: Locator;

    constructor(page: Page) {
        this.page = page;
        this.table = page.locator('.table-responsive');
        this.tableBody = this.table.locator('tbody');
        this.cartItems = this.tableBody.locator('tr.cart_item');
    }

    async verifyProductInCart(productName: string, expectedPrice: string) {
        const item = this.cartItems.filter({
            has: this.page.locator('td.product-details').getByRole('link', { name: productName })
        }).first();
        await expect(item).toBeVisible();
        // Convert expected price to match cart format (e.g. "1000" -> "$1,000.00")
        const formattedPrice = `$${parseFloat(expectedPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        await expect(item).toContainText(formattedPrice);
    }
}