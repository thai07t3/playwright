import { expect, type Locator, type Page } from "@playwright/test";
import { getFormattedPrice } from "../utils/helper.ts";

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

        const formattedPrice = getFormattedPrice(productPrice);
        await expect(productRow).toContainText(formattedPrice);
    }
}