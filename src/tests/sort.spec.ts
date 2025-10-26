import { test } from "../fixtures/test.context.ts";
import { Menu } from "../type/menu.ts";
import { SortType } from "../type/sort.ts";

test.describe("E-commerce Test Cases", () => {
  test(
    "TC04: Sort Products by Price in List View",
    {
      tag: ["@smoke", "@regression"],
    },
    async ({ loginPage, shopPage }) => {
      // 3. Go to Shop page
      await loginPage.navigateTo(Menu.Shop);

      // 4. Switch view to list
      await shopPage.switchViewTo("list");

      // 5-6:. Sort items by price (low to high / high to low) and verify order
      await shopPage.sortProductsBy(SortType.Sort_by_price_low_to_high);
      await shopPage.verifySortOrder(SortType.Sort_by_price_low_to_high);
      await shopPage.sortProductsBy(SortType.Sort_by_price_high_to_low);
      await shopPage.verifySortOrder(SortType.Sort_by_price_high_to_low);
    },
  );
});
