import type { Locator, Page } from "@playwright/test";
import { SortType } from "../type/sort.type.ts";

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
      case SortType.DEFAULT_SORTING:
        return new DefaultSortStrategy(sortDropdown, sortForm, page);
      case SortType.SORT_BY_POPULARITY:
        return new PopularitySortStrategy(sortDropdown, sortForm, page);
      case SortType.SORT_BY_AVERAGE_RATING:
        return new RatingSortStrategy(sortDropdown, sortForm, page);
      case SortType.SORT_BY_LATEST:
        return new NewnessSortStrategy(sortDropdown, sortForm, page);
      case SortType.SORT_BY_PRICE_LOW_TO_HIGH:
        return new LowToHighPriceSortStrategy(sortDropdown, sortForm, page);
      case SortType.SORT_BY_PRICE_HIGH_TO_LOW:
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
    return SortType.DEFAULT_SORTING;
  }
}

class PopularitySortStrategy extends BaseSortStrategy {
  getSortLabel(): string {
    return SortType.SORT_BY_POPULARITY;
  }
}

class RatingSortStrategy extends BaseSortStrategy {
  getSortLabel(): string {
    return SortType.SORT_BY_AVERAGE_RATING;
  }
}

class NewnessSortStrategy extends BaseSortStrategy {
  getSortLabel(): string {
    return SortType.SORT_BY_LATEST;
  }
}

class LowToHighPriceSortStrategy extends BaseSortStrategy {
  getSortLabel(): string {
    return SortType.SORT_BY_PRICE_LOW_TO_HIGH;
  }
}

class HighToLowPriceSortStrategy extends BaseSortStrategy {
  getSortLabel(): string {
    return SortType.SORT_BY_PRICE_HIGH_TO_LOW;
  }
}
