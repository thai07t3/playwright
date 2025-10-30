import type { Locator, Page } from "@playwright/test";
import { SortStrategyFactory } from "./sort.strategy.ts";
import { VerificationStrategyFactory } from "./verification.strategy.ts";
import type { Product } from "../models/product.ts";
import { SortType } from "../type/sort.ts";

export class SortManager {
  constructor(
    private sortDropdown: Locator,
    private sortForm: Locator,
    private page: Page,
  ) {}

  async sortBy(sortType: SortType): Promise<void> {
    const strategy = SortStrategyFactory.create(
      this.sortDropdown,
      this.sortForm,
      this.page,
      sortType,
    );
    await strategy.execute();
  }

  async shouldSortOrderBy(
    products: Product[],
    sortType: SortType,
  ): Promise<void> {
    const verificationStrategy = VerificationStrategyFactory.create(sortType);
    await verificationStrategy.verify(products);
  }
}
