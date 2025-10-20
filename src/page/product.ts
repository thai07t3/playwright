import { expect, type Locator, type Page } from "@playwright/test";
import { Product } from "../models/Product.ts";
import { HomePage } from "./home.ts";

export class ProductPage extends HomePage {
    readonly gridViewLink: Locator;
    readonly listViewLink: Locator;
    readonly items: Locator;

    constructor(page: Page) {
        super(page);
        this.items = this.page.locator('div.content-product');
        this.gridViewLink = this.page.locator('.switch-grid');
        this.listViewLink = this.page.locator('.switch-list');
    }

    async addRandomItemToCart(): Promise<Product> {
        const itemCount = await this.items.count();
        const random = Math.floor(Math.random() * itemCount);
        const itemInfo = await this.items.nth(random).innerText();
        const product = this.parseProductInfo(itemInfo);

        // Click add to cart button and wait for navigation
        await this.items.nth(random).getByText(/add to cart/i).last().click();
        return product;
    }

    async addMultipleRandomItemsToCart(count: number): Promise<Product[]> {
        const products: Product[] = [];
        const itemCount = await this.items.count();

        if (itemCount === 0) {
            console.log('No items available to add to cart');
            return products;
        }

        // Create array of unique random indices
        const selectedIndices = new Set<number>();
        const maxItems = Math.min(count, itemCount);

        while (selectedIndices.size < maxItems) {
            const randomIndex = Math.floor(Math.random() * itemCount);
            selectedIndices.add(randomIndex);
        }

        // Add each selected item to cart
        for (const index of Array.from(selectedIndices)) {
            const itemInfo = await this.items.nth(index).innerText();
            const product = this.parseProductInfo(itemInfo);

            // Click add to cart button and wait for navigation
            await this.items.nth(index).getByText(/add to cart/i).last().click();
            await this.page.waitForLoadState('networkidle');

            products.push(product);

            // Small delay between additions to prevent issues
            await this.page.waitForTimeout(1000);
        }

        return products;
    }

    async addSpecificItemToCart(index: number): Promise<Product | null> {
        const itemCount = await this.items.count();
        if (index >= itemCount || index < 0) {
            console.log(`Invalid item index: ${index}. Available items: ${itemCount}`);
            return null;
        }

        const itemInfo = await this.items.nth(index).innerText();
        const product = this.parseProductInfo(itemInfo);

        // Click add to cart button and wait for navigation
        await this.items.nth(index).getByText(/add to cart/i).last().click();
        await this.page.waitForLoadState('networkidle');

        return product;
    }

    async getAvailableItemsCount(): Promise<number> {
        return await this.items.count();
    }

    async getProductInfoByIndex(index: number): Promise<Product | null> {
        const itemCount = await this.items.count();
        if (index >= itemCount || index < 0) {
            return null;
        }

        const itemInfo = await this.items.nth(index).innerText();
        return this.parseProductInfo(itemInfo);
    }

    private parseProductInfo(text: string): Product {
        const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

        // Skip unnecessary lines
        const skipLines = ['SALE', 'Quick View', 'ADD TO CART', 'Add to wishlist'];
        const filteredLines = lines.filter(line => !skipLines.includes(line));

        // Get product information
        const productType = filteredLines[0] || '';
        const productName = filteredLines[1] || '';

        // Parse rating from line "Rated X.XX out of Y"
        let rating = 0;
        let totalRating = 0;
        const ratingLine = filteredLines.find(line => line.includes('Rated') && line.includes('out of'));
        if (ratingLine) {
            const ratingMatch = ratingLine.match(/Rated (\d+\.?\d*) out of (\d+)/);
            if (ratingMatch && ratingMatch[1] && ratingMatch[2]) {
                rating = parseFloat(ratingMatch[1]);
                totalRating = parseInt(ratingMatch[2]);
            }
        }

        // Parse price from line containing $ - get the last price if multiple prices exist
        let price = 0;
        const priceLine = filteredLines.find(line => line.includes('$'));
        if (priceLine) {
            // Find all prices in the line: e.g. $1,999.00 $1,000.00
            const priceMatches = priceLine.match(/\$(\d{1,3}(?:,\d{3})*\.?\d*)/g);
            if (priceMatches && priceMatches.length > 0) {
                // Get the last price (the price after sale)
                const lastPrice = priceMatches[priceMatches.length - 1];
                if (lastPrice) {
                    const cleanPrice = lastPrice.replace(/[$,]/g, ''); // Remove $ and comma
                    price = parseFloat(cleanPrice);
                }
            }
        }

        return new Product(productType, productName, rating, totalRating, price);
    }

    async switchToGridView() {
        await this.gridViewLink.click();
    }

    async switchToListView() {
        await this.listViewLink.click();
    }

    async switchViewTo(type: 'grid' | 'list') {
        if (type === 'grid') {
            await this.gridViewLink.click();
        } else {
            await this.listViewLink.click();
        }
    }

    async shouldBeInGridView() {
        await expect.soft(this.gridViewLink).toHaveClass(/switcher-active/);
        await this.page.waitForLoadState('networkidle');
        //TODO: Verify that the product items are displayed in a grid layout
    }

    async shouldBeInListView() {
        await expect.soft(this.listViewLink).toBeVisible();
        await this.page.waitForLoadState('networkidle');
        //TODO: Verify that the product items are displayed in a list layout
    }
}