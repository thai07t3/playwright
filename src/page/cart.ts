import { expect, type Locator, type Page } from "@playwright/test";
import { HomePage } from "./home.ts";
import { CartTable } from "../table/CartTable.ts";
import type { Product } from "../models/Product.ts";

export class CartPage extends HomePage {
    readonly cartTitle: Locator;
    readonly cartTable: CartTable;
    readonly totalPrice: Locator;
    readonly checkoutButton: Locator;

    constructor(page: Page) {
        super(page);
        this.cartTitle = this.page.getByText(/shopping cart/i);
        this.cartTable = new CartTable(page);
        this.totalPrice = this.page.getByText('Total').locator('..').getByText(/^\$\d+\.\d{2}$/);
        this.checkoutButton = this.page.getByRole('link', { name: 'Proceed to checkout' });
    }

    async shouldCartPageDisplayed() {
        await expect(this.page).toHaveURL(/.*\/cart/);
    }

    async shouldProductInCart(product: Product) {
        await this.cartTable.verifyProductInCart(product.getName, product.getPrice.toString());
    }

    async shouldMultipleProductsInCart(products: Product[]) {
        for (const product of products) {
            await this.shouldProductInCart(product);
        }
    }

    // async getCartSummary(): Promise<CartItem[]> {
    //     return await this.cartTable.getAllCartItems();
    // }

    // async isCartEmpty() {
    //     return await this.cartTable.isCartEmpty();
    // }

    async getTotalValue() {
        return await this.totalPrice.textContent();
    }

    async shouldCartContain(expectedProducts: Product[]) {
        await this.shouldCartPageDisplayed();
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
            if (await button.isVisible()) {
                await button.click();
                await this.page.waitForLoadState('networkidle'); // Wait for network to be idle
            }
        }
    }

    async proceedToCheckout() {
        await this.checkoutButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }
}