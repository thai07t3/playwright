import { expect } from "@playwright/test";
import type { Product } from "../models/product.ts";
import { SortType } from "../type/sort.ts";

export interface VerificationStrategy {
  verify(products: Product[]): Promise<void>;
}

export class VerificationStrategyFactory {
  static create(sortType: SortType): VerificationStrategy {
    switch (sortType) {
      case SortType.Sort_by_price_low_to_high:
        return new LowToHighPriceVerificationStrategy();
      case SortType.Sort_by_price_high_to_low:
        return new HighToLowPriceVerificationStrategy();
      //TODO: Implement other verification strategies as needed
      // case SortType.Default_sorting:
      // case SortType.Sort_by_popularity:
      // case SortType.Sort_by_average_rating:
      // case SortType.Sort_by_latest:
      default:
        throw new Error(`Unsupported verification for sort type: ${sortType}`);
    }
  }
}

class LowToHighPriceVerificationStrategy implements VerificationStrategy {
  async verify(products: Product[]): Promise<void> {
    for (let i = 0; i < products.length - 1; i++) {
      const currentProduct = products[i];
      const nextProduct = products[i + 1];

      if (!currentProduct || !nextProduct) continue;

      expect
        .soft(
          currentProduct.price,
          `Product at position ${i} (${currentProduct.name}: $${currentProduct.price}) should be less than or equal to product at position ${i + 1} (${nextProduct.name}: $${nextProduct.price})`,
        )
        .toBeLessThanOrEqual(nextProduct.price);
    }
  }
}

class HighToLowPriceVerificationStrategy implements VerificationStrategy {
  async verify(products: Product[]): Promise<void> {
    for (let i = 0; i < products.length - 1; i++) {
      const currentProduct = products[i];
      const nextProduct = products[i + 1];

      if (!currentProduct || !nextProduct) continue;

      expect
        .soft(
          currentProduct.price,
          `Product at position ${i} (${currentProduct.name}: $${currentProduct.price}) should be greater than or equal to product at position ${i + 1} (${nextProduct.name}: $${nextProduct.price})`,
        )
        .toBeGreaterThanOrEqual(nextProduct.price);
    }
  }
}
