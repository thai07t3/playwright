import { expect, type Locator, type Page } from "@playwright/test";
import { HomePage } from "./home.ts";
import type { CartItem } from "../models/CartItem.ts";
import { CartTable } from "../table/CartTable.ts";

export class CartPage extends HomePage {
    readonly cartTitle: Locator;
    readonly cartTable: CartTable;

    constructor(page: Page) {
        super(page);
        this.cartTitle = this.page.locator('h1').filter({ hasText: /shopping cart/i }).or(
            this.page.getByRole('heading', { name: /shopping cart/i })
        );
        this.cartTable = new CartTable(page);
    }

    async shouldCartPageDisplayed() {
        await expect(this.page).toHaveURL(/.*\/cart/);
        await this.page.waitForLoadState('domcontentloaded');

        // Check for elements containing "cart" text (case insensitive)
        const cartElements = await this.page.locator('*').filter({ hasText: /cart/i }).count();
        if (cartElements === 0) {
            throw new Error('Cart page not properly loaded - no cart-related elements found');
        }
    }

    async verifyProductInCart(productName: string, expectedPrice: string): Promise<void> {
        const isVerified = await this.cartTable.verifyProductInCart(productName, expectedPrice);
        expect(isVerified).toBe(true);
    }

    async verifyMultipleProducts(products: Array<{ name: string, price: string }>): Promise<void> {
        for (const product of products) {
            await this.verifyProductInCart(product.name, product.price);
        }
    }

    async getCartSummary(): Promise<CartItem[]> {
        return await this.cartTable.getAllCartItems();
    }

    async isCartEmpty(): Promise<boolean> {
        return await this.cartTable.isCartEmpty();
    }

    async getTotalCartValue(): Promise<string> {
        return await this.cartTable.getTotalCartValue();
    }

    async verifyCartContents(expectedProducts: any[]) {
        await this.navigateToCart();
        await this.shouldCartPageDisplayed();

        for (const product of expectedProducts) {
            await this.verifyProductInCart(product.getName, product.getPrice);
        }
    }

    async clearCart() {
        await this.navigateToCart();
        const removeButtons = this.page.getByText("Remove");
        const buttonCount = await removeButtons.count();

        for (let i = 0; i < buttonCount; i++) {
            const button = removeButtons.first(); // Always get first as DOM updates after removal
            if (await button.isVisible()) {
                await button.click();
                await this.page.waitForTimeout(5000); // Wait for removal to process
            }
        }
    }

    async verifyCartSummary() {
        const cartItems = await this.getCartSummary();
        const totalValue = await this.getTotalCartValue();

        console.log(`Total items: ${cartItems.length}`);
        console.log(`Total value: ${totalValue}`);

        for (const item of cartItems) {
            console.log(`- ${item.name}: ${item.price} (Qty: ${item.quantity})`);
        }
    }
}