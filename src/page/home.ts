import type { Locator, Page } from "@playwright/test";
import type { Department } from "../type/all.deparments.ts";

export class HomePage {
  readonly page: Page;
  readonly popupTitle: Locator;
  readonly closePopupButton: Locator;
  readonly loginLink: Locator;
  readonly allDepartmentsLabel: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.popupTitle = this.page.getByText("Our Spring Sale Has Started");
    this.closePopupButton = this.page.getByRole("button", { name: "Close" });
    this.loginLink = this.page.getByRole("link", { name: "Log in / Sign up" });
    this.allDepartmentsLabel = this.page.getByText("All Departments");
    this.cartLink = this.page.locator(".cart-type1 svg").first();
  }

  async closePopupIfPresent() {
    const isPopupVisible = await this.popupTitle
      .waitFor({ state: "visible", timeout: 10_000 })
      .then(() => true)
      .catch(() => false);
    if (isPopupVisible) {
      await this.closePopupButton.click();
    }
  }

  async goToLogin() {
    await this.loginLink.click();
  }

  async goToCart() {
    await this.cartLink.scrollIntoViewIfNeeded();
    await this.cartLink.click();
  }

  async selectDepartment(departmentName: Department) {
    await this.allDepartmentsLabel.hover();
    const departmentLink = this.page
      .locator(".item-link")
      .filter({ hasText: departmentName })
      .first();
    await departmentLink.scrollIntoViewIfNeeded();
    await departmentLink.click();
  }
}
