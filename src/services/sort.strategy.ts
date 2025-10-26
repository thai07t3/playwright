import type { Locator, Page } from "@playwright/test";
import { SortType } from "../type/sort.ts";

export interface SortStrategy {
  execute(): Promise<void>;
}

export class SortStrategyFactory {
  static create(
    sortDropdown: Locator,
    sortForm: Locator,
    page: Page,
    sortType: SortType,
  ): SortStrategy {
    switch (sortType) {
      case SortType.Default_sorting:
        return new DefaultSortStrategy(sortDropdown, sortForm, page);
      case SortType.Sort_by_popularity:
        return new PopularitySortStrategy(sortDropdown, sortForm, page);
      case SortType.Sort_by_average_rating:
        return new RatingSortStrategy(sortDropdown, sortForm, page);
      case SortType.Sort_by_latest:
        return new NewnessSortStrategy(sortDropdown, sortForm, page);
      case SortType.Sort_by_price_low_to_high:
        return new LowToHighPriceSortStrategy(sortDropdown, sortForm, page);
      case SortType.Sort_by_price_high_to_low:
        return new HighToLowPriceSortStrategy(sortDropdown, sortForm, page);
      default:
        throw new Error(`Unsupported sort type: ${sortType}`);
    }
  }
}

abstract class BaseSortStrategy implements SortStrategy {
  constructor(
    protected sortDropdown: Locator,
    protected sortForm: Locator,
    protected page: Page,
  ) {}

  abstract getSortLabel(): string;

  async execute(): Promise<void> {
    // Select the desired sort option
    await this.sortDropdown.selectOption({ label: this.getSortLabel() });
    // Trigger form submission and wait for page to load
    await this.sortForm.evaluate((form: HTMLFormElement) => form.submit());
    await this.page.waitForLoadState("networkidle");
  }
}

class DefaultSortStrategy extends BaseSortStrategy {
  getSortLabel(): string {
    return SortType.Default_sorting;
  }
}

class PopularitySortStrategy extends BaseSortStrategy {
  getSortLabel(): string {
    return SortType.Sort_by_popularity;
  }
}

class RatingSortStrategy extends BaseSortStrategy {
  getSortLabel(): string {
    return SortType.Sort_by_average_rating;
  }
}

class NewnessSortStrategy extends BaseSortStrategy {
  getSortLabel(): string {
    return SortType.Sort_by_latest;
  }
}

class LowToHighPriceSortStrategy extends BaseSortStrategy {
  getSortLabel(): string {
    return SortType.Sort_by_price_low_to_high;
  }
}

class HighToLowPriceSortStrategy extends BaseSortStrategy {
  getSortLabel(): string {
    return SortType.Sort_by_price_high_to_low;
  }
}
