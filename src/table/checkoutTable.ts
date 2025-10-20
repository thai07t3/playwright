import { expect, type Locator, type Page } from "@playwright/test";

export class CheckoutTable {
    readonly page: Page;
    readonly table: Locator;
    readonly tableBody: Locator;

    constructor(page: Page) {
        this.page = page;
        this.table = page.getByTestId('order_review');
        this.tableBody = this.table.locator('tbody');
    }

    async verifyProductInCheckout(productName: string, productPrice: string) {
        const productRow = this.tableBody.getByRole('row').filter({
            hasText: productName
        });

        await expect(productRow).toBeVisible();

        // Verify the product name is present in the row
        // await expect(productRow).toContainText(productName);

        // Format the price and verify it's present in the row
        const formattedPrice = `$${parseFloat(productPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        await expect(productRow).toContainText(formattedPrice);
    }
}