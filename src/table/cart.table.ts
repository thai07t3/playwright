import { expect, type Locator, type Page } from "@playwright/test";
import { getFormattedPrice } from "../utils/helper.ts";

export class CartTable {
  readonly page: Page;
  readonly table: Locator;
  readonly tableBody: Locator;
  readonly cartItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.table = page.locator(".table-responsive");
    this.tableBody = this.table.locator("tbody");
    this.cartItems = this.tableBody.locator("tr.cart_item");
  }

  async shouldProductInCart(productName: string, expectedPrice: string) {
    const item = this.cartItems
      .filter({
        has: this.page
          .locator("td.product-details")
          .getByRole("link", { name: productName }),
      })
      .first();
    await expect(item).toBeVisible();
    const formattedPrice = getFormattedPrice(expectedPrice);
    await expect(item).toContainText(formattedPrice);
  }
}
