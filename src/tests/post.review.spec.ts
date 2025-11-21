import { test } from "../fixtures/test.context.ts";
import { Menu } from "../type/menu.type.ts";
import { faker } from "@faker-js/faker";
import { randomInRange } from "../utils/random.ts";

test.describe("Post Review Test Cases", () => {
  test(
    "TC10: Verify users can post a review",
    {
      tag: ["@smoke", "@regression"],
    },
    async ({ accountPage, shopPage, productDetails }) => {
      const rating = randomInRange(1, 5);
      const reviewText = faker.lorem.sentence();

      // Step 3: Go to Shop page
      await accountPage.navigateTo(Menu.SHOP);

      // Step 4: Click on a product to view detail
      await shopPage.openRandomProduct();

      // Step 5: Scroll down then click on REVIEWS tab
      await productDetails.goToReviews();

      // Step 6: Submit a review
      await productDetails.submitReview(rating, reviewText);

      // Step 7: Verify new review and verify review summary is updated
      await productDetails.goToReviews();
      await productDetails.shouldReviewDisplay(rating, reviewText);
      await productDetails.shouldProductReviewUpdate();
    },
  );
});
