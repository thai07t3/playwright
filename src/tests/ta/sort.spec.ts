import { test } from "../../fixtures/test.context.ts";
import { Menu } from "../../type/menu.type.ts";
import { SortType } from "../../type/sort.type.ts";

test.describe("E-commerce Test Cases", () => {
  test(
    "TC04: Sort Products by Price in List View",
    {
      tag: ["@smoke", "@regression"],
    },
    async ({ accountPage, shopPage }) => {
      // 3. Go to Shop page
      await accountPage.navigateTo(Menu.SHOP);

      // 4. Switch view to list
      await shopPage.switchViewTo("list");

      // 5-6:. Sort items by price (low to high / high to low) and verify order
      await shopPage.sortProductsBy(SortType.SORT_BY_PRICE_LOW_TO_HIGH);
      await shopPage.shouldSortOrderBy(SortType.SORT_BY_PRICE_LOW_TO_HIGH);
      await shopPage.sortProductsBy(SortType.SORT_BY_PRICE_HIGH_TO_LOW);
      await shopPage.shouldSortOrderBy(SortType.SORT_BY_PRICE_HIGH_TO_LOW);
    },
  );
});
