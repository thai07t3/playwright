import { expect, type Locator, type Page } from "@playwright/test";
import { Product } from "../models/product.ts";

export class ProductPage {
    readonly page: Page;
    readonly gridViewLink: Locator;
    readonly listViewLink: Locator;
    readonly items: Locator;

    constructor(page: Page) {
        this.page = page;
        this.items = this.page.locator('div.content-product');
        this.gridViewLink = this.page.locator('.switch-grid');
        this.listViewLink = this.page.locator('.switch-list');
    }

    async selectRandomItem(): Promise<Product> {
        const randomIndex = Math.floor(Math.random() * await this.items.count());
        const itemInfo = await this.items.nth(randomIndex).innerText();
        const product = this.parseProductInfo(itemInfo);
        await this.items.nth(randomIndex).click();
        return product;
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
    }

    async shouldBeInListView() {
        await expect.soft(this.listViewLink).toHaveClass(/switcher-active/);
    }
}