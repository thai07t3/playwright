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

      // const originalProducts = await shopPage.getAllProducts();
      // for (const product of originalProducts) {
      //     console.log(`Product: ${product.name}, Price: ${product.price}`);
      // }

      // 5. Sort items by price (low to high / high to low)
      await shopPage.sortProductsBy(SortType.Sort_by_price_low_to_high);

      // 6. Verify the order of items
      await shopPage.verifySortOrder(SortType.Sort_by_price_low_to_high);
      // console.log("Sorted Products (Low to High):");
      // const sortedLowToHightProducts = await shopPage.getAllProducts();
      // for (const product of sortedLowToHightProducts) {
      //     console.log(`Product: ${product.name}, Price: ${product.price}`);
      // }

      await shopPage.sortProductsBy(SortType.Sort_by_price_high_to_low);
      // await shopPage.verifySortOrder(SortType.Sort_by_price_high_to_low);
      // console.log("Sorted Products (High to Low):");
      // const sortedHighToLowProducts = await shopPage.getAllProducts();
      // for (const product of sortedHighToLowProducts) {
      //     console.log(`Product: ${product.name}, Price: ${product.price}`);
      // }
      // console.log("Sort by Price test completed successfully");
    },
  );
});
