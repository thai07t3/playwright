import { expect, type Locator, type Page } from "@playwright/test";
import { getFormattedPrice } from "../utils/helper.ts";
import type { CartItem } from "../models/cart.item.ts";

export class CartTable {
  readonly page: Page;
  readonly table: Locator;
  readonly tableBody: Locator;

  constructor(page: Page) {
    this.page = page;
    this.table = page.locator(".table-responsive");
    this.tableBody = this.table.getByRole("rowgroup").last();
  }

  async shouldProductInCart(productName: string, expectedPrice: string) {
    const productRow = this.getProductRow(productName);
    await expect(productRow).toBeVisible();
    const formattedPrice = getFormattedPrice(expectedPrice);
    await expect(productRow).toContainText(formattedPrice);
  }

  private getProductRow(productName: string) {
    return this.tableBody
      .getByRole("row")
      .filter({
        hasText: productName,
      })
      .first();
  }

  async getProductQuantity(productName: string) {
    const productRow = this.getProductRow(productName);
    const quantityInput = productRow.getByRole("spinbutton", {
      name: `${productName} quantity`,
    });
    return await quantityInput.inputValue();
  }

  async getProductSubtotal(productName: string) {
    const productRow = this.getProductRow(productName);
    const subtotal = productRow.getByRole("cell", {
      name: /^\$\d+(\.\d{2})?$/,
    });
    return (await subtotal.textContent()) || "";
  }

  async shouldHaveCartItem(cartItem: CartItem) {
    const productRow = this.getProductRow(cartItem.name);
    await expect(productRow).toBeVisible();

    // Verify quantity
    const quantityInput = productRow.getByRole("spinbutton", {
      name: `${cartItem.name} quantity`,
    });
    await expect(quantityInput).toHaveValue(cartItem.quantity.toString());

    // Verify subtotal
    const formattedSubtotal = getFormattedPrice(cartItem.subtotal);
    await expect(productRow).toContainText(formattedSubtotal);
  }

  async increaseQuantity(productName: string) {
    const productRow = this.getProductRow(productName);
    const plusButton = productRow.locator("span.plus");
    await plusButton.click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async decreaseQuantity(productName: string) {
    const productRow = this.getProductRow(productName);
    const minusButton = productRow.locator("span.minus");
    await minusButton.click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async changeQuantityTo(productName: string, quantity: number) {
    const productRow = this.getProductRow(productName);
    const quantityInput = productRow.getByRole("spinbutton", {
      name: `${productName} quantity`,
    });
    await quantityInput.fill(quantity.toString());
  }
}
