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

    // async getCartItemsCount(): Promise<number> {
    //     // Check if cart is empty first
    //     const isEmpty = await this.isCartEmpty();
    //     if (isEmpty) {
    //         return 0;
    //     }

    //     await this.table.waitFor({ state: 'visible' });
    //     return await this.cartItems.count();
    // }

    // async getCartItemByIndex(index: number): Promise<CartItem> {
    //     const item = this.cartItems.nth(index);

    //     // Wait for item to be visible before extracting data
    //     await item.waitFor({ state: 'visible' });

    //     //TODO: Improve selectors if possible
    //     const nameElement = item.locator('td.product-details').getByRole('link', { name: /.*/ }).first();
    //     const priceElement = item.locator('td.product-price').locator('.woocommerce-Price-amount').first();
    //     const quantityInput = item.locator('td.product-quantity').getByRole('spinbutton');
    //     const subtotalElement = item.locator('td.product-subtotal').locator('.woocommerce-Price-amount').first();

    //     // Extract data with proper error handling
    //     const name = await nameElement.textContent() || '';
    //     const price = await priceElement.textContent() || '';
    //     const quantityValue = await quantityInput.getAttribute('value') || '0';
    //     const quantity = parseInt(quantityValue);
    //     const subtotal = await subtotalElement.textContent() || '';

    //     // Get optional attributes
    //     const thumbnailElement = item.locator('td.product-name img').first();
    //     const removeElement = item.locator('td.product-details').getByRole('link', { name: /remove/i });

    //     const thumbnailSrc = await thumbnailElement.getAttribute('src').catch(() => undefined);
    //     const removeHref = await removeElement.getAttribute('href').catch(() => undefined);

    //     return {
    //         name: name.trim(),
    //         price: price.trim(),
    //         quantity: quantity,
    //         subtotal: subtotal.trim(),
    //         thumbnail: thumbnailSrc || undefined,
    //         removeLink: removeHref || undefined
    //     };
    // }

    // async getCartItemByName(productName: string): Promise<CartItem | null> {
    //     const itemsCount = await this.getCartItemsCount();

    //     for (let i = 0; i < itemsCount; i++) {
    //         const item = await this.getCartItemByIndex(i);
    //         if (item.name === productName) {
    //             return item;
    //         }
    //     }

    //     return null;
    // }

    // async getAllCartItems(): Promise<CartItem[]> {
    //     const itemsCount = await this.getCartItemsCount();
    //     const items: CartItem[] = [];

    //     // Check actual visible items vs expected count
    //     const actualVisibleItems = await this.cartItems.count();
    //     const safeCount = Math.min(itemsCount, actualVisibleItems);

    //     for (let i = 0; i < safeCount; i++) {
    //         try {
    //             const item = await this.getCartItemByIndex(i);
    //             items.push(item);
    //         } catch (error) {
    //             console.log(`Error getting item ${i}: ${error}`);
    //             break; // Stop if we encounter an error
    //         }
    //     }

    //     return items;
    // }

    // async verifyProductInCart(productName: string, expectedPrice: string): Promise<boolean> {
    //     const item = await this.getCartItemByName(productName);

    //     if (!item) {
    //         console.log(`Product "${productName}" not found in cart`);
    //         return false;
    //     }

    //     const priceMatch = item.price.includes(expectedPrice);

    //     if (!priceMatch) {
    //         console.log(`Price mismatch for "${productName}". Expected: ${expectedPrice}, Actual: ${item.price}`);
    //         return false;
    //     }

    //     console.log(`Product "${productName}" verified successfully with price: ${item.price}`);
    //     return true;
    // }

    // async updateQuantity(productName: string, newQuantity: number): Promise<void> {
    //     const item = this.cartItems.filter({
    //         has: this.page.locator('td.product-details').getByRole('link', { name: productName })
    //     }).first();

    //     await item.waitFor({ state: 'visible' });

    //     const quantityInput = item.locator('td.product-quantity').getByRole('spinbutton');
    //     await quantityInput.fill(newQuantity.toString());

    //     // Optional: Trigger update by pressing Enter or clicking update button
    //     await quantityInput.press('Enter');
    // }

    // async removeProduct(productName: string): Promise<void> {
    //     try {
    //         // Try to find item by exact name first
    //         let item = this.cartItems.filter({
    //             has: this.page.locator('td.product-details').getByRole('link', { name: productName })
    //         }).first();

    //         // If not found, try partial name
    //         const itemCount = await this.cartItems.count();
    //         let foundIndex = -1;

    //         for (let i = 0; i < itemCount; i++) {
    //             const currentItem = this.cartItems.nth(i);
    //             const nameElement = currentItem.locator('td.product-details').getByRole('link').first();
    //             const actualName = await nameElement.textContent();

    //             if (actualName && actualName.trim() === productName.trim()) {
    //                 foundIndex = i;
    //                 break;
    //             }
    //         }

    //         if (foundIndex >= 0) {
    //             item = this.cartItems.nth(foundIndex);
    //             await item.waitFor({ state: 'visible' });

    //             const removeButton = item.locator('td.product-details').getByRole('link', { name: /remove/i });
    //             await removeButton.click();

    //             // Wait for page to update after removal
    //             await this.page.waitForTimeout(1000);
    //             console.log(`✓ Removed product: ${productName}`);
    //         } else {
    //             console.log(`⚠️ Product not found for removal: ${productName}`);
    //         }
    //     } catch (error) {
    //         console.log(`⚠️ Error removing product ${productName}: ${error}`);
    //     }
    // }

    // async waitForCartTableToLoad(): Promise<void> {
    //     // Only wait for table if cart is not empty
    //     const isEmpty = await this.isCartEmpty();
    //     if (!isEmpty) {
    //         await this.table.waitFor({ state: 'visible' });
    //         await this.page.waitForLoadState('domcontentloaded');
    //     }
    // }

    // async isCartEmpty(): Promise<boolean> {
    //     try {
    //         const emptyCartMessage = this.page.getByText(/your cart is currently empty/i);
    //         return await emptyCartMessage.isVisible();
    //     } catch {
    //         const itemsCount = await this.getCartItemsCount();
    //         return itemsCount === 0;
    //     }
    // }

    // async getCartItemByPartialName(partialName: string): Promise<CartItem | null> {
    //     const itemsCount = await this.getCartItemsCount();

    //     for (let i = 0; i < itemsCount; i++) {
    //         const item = await this.getCartItemByIndex(i);
    //         if (item.name.toLowerCase().includes(partialName.toLowerCase())) {
    //             return item;
    //         }
    //     }

    //     return null;
    // }

    // // async getTotalCartValue(): Promise<string> {
    // //     // Find element containing total cart value
    // //     const totalElement = this.page.locator('.cart-totals').getByText(/total/i).locator('..').locator('.woocommerce-Price-amount').first();
    // //     await totalElement.waitFor({ state: 'visible' });
    // //     return await totalElement.textContent() || '0';
    // // }

    // async increaseQuantity(productName: string, times: number = 1): Promise<void> {
    //     const item = this.cartItems.filter({
    //         has: this.page.locator('td.product-details').getByRole('link', { name: productName })
    //     }).first();

    //     await item.waitFor({ state: 'visible' });

    //     const plusButton = item.locator('td.product-quantity').locator('.plus');

    //     for (let i = 0; i < times; i++) {
    //         await plusButton.click();
    //         await this.page.waitForTimeout(500); // Wait for quantity update
    //     }
    // }

    // async decreaseQuantity(productName: string, times: number = 1): Promise<void> {
    //     const item = this.cartItems.filter({
    //         has: this.page.locator('td.product-details').getByRole('link', { name: productName })
    //     }).first();

    //     await item.waitFor({ state: 'visible' });

    //     const minusButton = item.locator('td.product-quantity').locator('.minus');

    //     for (let i = 0; i < times; i++) {
    //         await minusButton.click();
    //         await this.page.waitForTimeout(500); // Wait for quantity update
    //     }
    // }
}