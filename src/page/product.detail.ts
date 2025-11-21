import { expect, type Locator, type Page } from "@playwright/test";
import { HomePage } from "./home.ts";

export class ProductDetailPage extends HomePage {
  readonly reviewSummary: Locator;
  readonly reviewLink: Locator;
  readonly submitButton: Locator;
  readonly commentField: Locator;
  readonly commentList: Locator;

  private static readonly RATING_PATTERN = /Rated\s+([\d.]+)\s+out\s+of\s+5/;

  constructor(page: Page) {
    super(page);
    this.reviewSummary = this.page
      .locator(".fixed-content")
      .locator(".star-rating");
    this.reviewLink = this.page.getByRole("link", { name: /Reviews/i });
    this.submitButton = this.page.getByRole("button", { name: "Submit" });
    this.commentField = this.page.getByTestId("comments");
    this.commentList = this.page.locator(".commentlist");
  }

  async goToReviews() {
    await this.reviewLink.click();
  }

  async submitReview(rating: number, reviewText: string) {
    await this.page
      .getByTestId("commentform")
      .locator(`.star-${rating}`)
      .click();
    await this.page
      .getByRole("textbox", { name: "Your review" })
      .fill(reviewText);
    await this.submitButton.click();

    await this.page.waitForLoadState("domcontentloaded");
  }

  async shouldReviewDisplay(rating: number, reviewText: string) {
    const comment = this.commentList.getByRole("listitem").filter({
      hasText: reviewText,
    });

    await expect(comment).toBeVisible();
    await expect(comment).toContainText(`Rated ${rating} out of 5`);
  }

  async shouldProductReviewUpdate() {
    const totalComments = this.commentList.getByRole("listitem");
    const comments = await totalComments.all();
    const numberOfReviews = comments.length;

    const averageRating =
      (await this.calculateTotalRating(comments)) / numberOfReviews;
    const ratingText =
      numberOfReviews === 1 ? "customer rating" : "customer ratings";

    const expectedText = `Rated ${averageRating.toFixed(2)} out of 5 based on ${numberOfReviews} ${ratingText}`;
    await expect(this.reviewSummary).toHaveText(expectedText);
  }

  private async calculateTotalRating(comments: Locator[]) {
    let totalRating = 0;

    for (const comment of comments) {
      const ratingText = await comment.locator(".star-rating").textContent();
      if (ratingText) {
        const ratingMatch = ratingText.match(ProductDetailPage.RATING_PATTERN);
        if (ratingMatch?.[1]) {
          totalRating += parseFloat(ratingMatch[1]);
        }
      }
    }

    return totalRating;
  }
}
