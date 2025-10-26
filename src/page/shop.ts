import { expect, type Locator, type Page } from "@playwright/test";
import { Product } from "../models/product.ts";
import { HomePage } from "./home.ts";
import { random } from "../utils/random.ts";
import { GRID_SIZE, LIST_SIZE } from "../utils/helper.ts";
import { SortManager } from "../services/sort.manager.ts";
import { SortType } from "../type/sort.ts";

export class ShopPage extends HomePage {
  readonly gridViewLink: Locator;
  readonly listViewLink: Locator;
  readonly items: Locator;
  readonly loadingCircle: Locator;
  readonly sortDropdown: Locator;
  readonly sortForm: Locator;
  private readonly sortManager: SortManager;

  constructor(page: Page) {
    super(page);
    this.items = this.page.locator("div.content-product");
    this.gridViewLink = this.page.locator(".switch-grid");
    this.listViewLink = this.page.locator(".switch-list");
    this.loadingCircle = this.page.locator(".et-loader svg").last();
    this.sortDropdown = this.page.getByLabel('Shop order');
    this.sortForm = this.page.locator("form.woocommerce-ordering"); // another locator don't work
    this.sortManager = new SortManager(
      this.sortDropdown,
      this.sortForm,
      this.page,
    );
  }

  private async addItemToCartByIndex(index: number): Promise<Product> {
    const itemInfo = await this.items.nth(index).innerText();
    const product = this.parseProductInfo(itemInfo);

    // Add to cart and wait for loading to complete
    await this.items
      .nth(index)
      .getByText(/add to cart/i)
      .last()
      .click();
    await this.loadingCircle.waitFor({ state: "hidden" });

    return product;
  }

  async addRandomItemToCart(): Promise<Product> {
    const itemCount = await this.items.count();
    const randomIndex = random(itemCount);
    const product = await this.addItemToCartByIndex(randomIndex);
    return product;
  }

  async addMultipleRandomItemsToCart(count: number): Promise<Product[]> {
    const itemCount = await this.items.count();

    // Generate array of unique random indices
    const selectedIndices = new Set<number>();
    const maxItems = Math.min(count, itemCount);

    while (selectedIndices.size < maxItems) {
      const randomIndex = random(itemCount);
      selectedIndices.add(randomIndex);
    }

    // Add each selected item to cart using helper method
    const products: Product[] = [];
    for (const index of selectedIndices) {
      const product = await this.addItemToCartByIndex(index);
      products.push(product);
    }

    return products;
  }

  async addMultipleItemsToCart(count: number = 3): Promise<Product[]> {
    const products: Product[] = [];
    for (let i = 1; i <= count; i++) {
      const product = await this.addItemToCartByIndex(i);
      products.push(product);
    }
    return products;
  }

  async addSpecificItemToCart(index: number): Promise<Product> {
    return await this.addItemToCartByIndex(index);
  }

  async getAvailableItemsCount(): Promise<number> {
    return await this.items.count();
  }

  async getProductInfoByIndex(index: number): Promise<Product> {
    const itemInfo = await this.items.nth(index).innerText();
    return this.parseProductInfo(itemInfo);
  }

  private parseProductInfo(text: string): Product {
    const filteredLines = this.filterProductLines(text);

    const productType = this.extractProductType(filteredLines);
    const productName = this.extractProductName(filteredLines);
    const { rating, totalRating } = this.extractRatingInfo(filteredLines);
    const price = this.extractPrice(filteredLines);

    return new Product(productType, productName, rating, totalRating, price);
  }

  private filterProductLines(text: string): string[] {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    const skipLines = ["SALE", "Quick View", "ADD TO CART", "Add to wishlist"];
    return lines.filter((line) => !skipLines.includes(line));
  }

  private extractProductType(filteredLines: string[]): string {
    return filteredLines[0] || "";
  }

  private extractProductName(filteredLines: string[]): string {
    return filteredLines[1] || "";
  }

  private extractRatingInfo(filteredLines: string[]): {
    rating: number;
    totalRating: number;
  } {
    let rating = 0;
    let totalRating = 0;

    const ratingLine = filteredLines.find(
      (line) => line.includes("Rated") && line.includes("out of"),
    );
    if (ratingLine) {
      const ratingMatch = ratingLine.match(/Rated (\d+\.?\d*) out of (\d+)/);
      if (ratingMatch && ratingMatch[1] && ratingMatch[2]) {
        rating = parseFloat(ratingMatch[1]);
        totalRating = parseInt(ratingMatch[2]);
      }
    }

    return { rating, totalRating };
  }

  private extractPrice(filteredLines: string[]): number {
    let price = 0;

    const priceLine = filteredLines.find((line) => line.includes("$"));
    if (priceLine) {
      // Find all prices in the line: e.g. $1,999.00 $1,000.00
      const priceMatches = priceLine.match(/\$(\d{1,3}(?:,\d{3})*\.?\d*)/g);
      if (priceMatches && priceMatches.length > 0) {
        // Get the last price (the price after sale)
        const lastPrice = priceMatches[priceMatches.length - 1];
        if (lastPrice) {
          const cleanPrice = lastPrice.replace(/[$,]/g, ""); // Remove $ and comma
          price = parseFloat(cleanPrice);
        }
      }
    }

    return price;
  }

  async switchToGridView() {
    await this.gridViewLink.click();
  }

  async switchToListView() {
    await this.listViewLink.click();
  }

  async switchViewTo(type: "grid" | "list") {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    type === "grid"
      ? await this.switchToGridView()
      : await this.switchToListView();
  }

  async shouldBeInGridView() {
    await this.shouldBeInView(this.gridViewLink, GRID_SIZE);
  }

  async shouldBeInListView() {
    await this.shouldBeInView(this.listViewLink, LIST_SIZE);
  }

  private async shouldBeInView(activeLink: Locator, expectedWidth: string) {
    // Verify the correct view link is active
    await expect.soft(activeLink).toHaveClass(/switcher-active/);

    for (const item of await this.items.all()) {
      const width = await item.locator("xpath=..").evaluate((el) => {
        return window.getComputedStyle(el).getPropertyValue("width");
      });
      expect.soft(width).toBe(expectedWidth);
    }
  }

  async getAllProducts(): Promise<Product[]> {
    const products: Product[] = [];
    const itemCount = await this.items.count();

    for (let i = 0; i < itemCount; i++) {
      const product = await this.getProductInfoByIndex(i);
      products.push(product);
    }

    return products;
  }

  async sortProductsBy(sortType: SortType): Promise<void> {
    await this.sortManager.sortBy(sortType);
  }

  async verifySortOrder(sortType: SortType): Promise<void> {
    const products = await this.getAllProducts();
    await this.sortManager.verifySortOrder(products, sortType);
  }
}
