import { expect, type Locator, type Page } from "@playwright/test";
import { HomePage } from "./home.ts";
import { CartTable } from "../../table/cart.table.ts";
import type { Product } from "../../models/product.ts";
import type { CartItem } from "../../models/cart.item.ts";

export class CartPage extends HomePage {
  readonly cartTitle: Locator;
  readonly cartTable: CartTable;
  readonly totalPrice: Locator;
  readonly checkoutButton: Locator;
  readonly clearCartButton: Locator;
  readonly emptyCartMessage: Locator;
  readonly updateCartButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartTitle = this.page.getByText(/shopping cart/i);
    this.cartTable = new CartTable(page);
    this.totalPrice = this.page
      .getByRole("cell")
      .filter({ hasText: /^\$\d+\.\d{2}$/ })
      .last();
    this.checkoutButton = this.page.getByRole("link", {
      name: "Proceed to checkout",
    });
    this.clearCartButton = this.page.getByText("Clear shopping cart");
    this.emptyCartMessage = this.page.getByRole("heading", {
      name: "YOUR SHOPPING CART IS EMPTY",
    });
    this.updateCartButton = this.page.getByRole("button", {
      name: "Update cart",
    });
  }

  async shouldCartPageDisplay() {
    await expect(this.page).toHaveURL(/.*\/cart/);
  }

  async shouldProductInCart(product: Product) {
    await this.cartTable.shouldProductInCart(
      product.name,
      product.price.toString(),
    );
  }

  async shouldMultipleProductsInCart(products: Product[]) {
    for (const product of products) {
      await this.shouldProductInCart(product);
    }
  }

  async getTotalValue() {
    return await this.totalPrice.textContent();
  }

  async shouldCartContain(expectedProducts: Product[]) {
    await this.shouldCartPageDisplay();
    for (const product of expectedProducts) {
      await this.shouldProductInCart(product);
    }
  }

  async checkout() {
    await this.checkoutButton.click();
  }

  async clearCart() {
    await this.goToCart();
    const removeButtons = this.page.getByText("Remove");
    const buttonCount = await removeButtons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = removeButtons.first(); // Always get first as DOM updates after removal
      // await button.waitFor({ state: 'visible' });
      await button.click();
      await this.page.waitForLoadState("networkidle"); // Wait for network to be idle
    }
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async clearShoppingCart() {
    // Handle confirmation dialog (can be skipped due to auto-accept in Playwright config)
    this.page.on("dialog", async (dialog) => {
      await dialog.accept();
    });
    await this.clearCartButton.click();
  }

  async shouldShowEmptyCartMessage() {
    await expect(this.emptyCartMessage).toBeVisible();
  }

  async updateCart() {
    await this.updateCartButton.click();
    await this.waitForBlockUIToDisappear();
  }

  async isUpdateCartButtonEnabled() {
    const updateCartButton = this.page.getByRole("button", {
      name: "Update cart",
    });
    return await updateCartButton.isEnabled();
  }

  async shouldHaveCartItem(cartItem: CartItem) {
    await this.cartTable.shouldHaveCartItem(cartItem);
  }

  async increaseProductQuantity(productName: string) {
    await this.cartTable.increaseQuantity(productName);
  }

  async decreaseProductQuantity(productName: string) {
    await this.cartTable.decreaseQuantity(productName);
  }

  async setProductQuantity(productName: string, quantity: number) {
    await this.cartTable.changeQuantityTo(productName, quantity);
  }

  async shouldHaveProductWithQuantity(
    product: Product,
    expectedQuantity: number,
  ) {
    await this.shouldHaveCartItem(product.toCartItem(expectedQuantity));
  }
}
