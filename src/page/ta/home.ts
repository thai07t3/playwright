import type { Locator, Page } from "@playwright/test";
import type { Department } from "../../type/deparments.type.ts";

export class HomePage {
  readonly page: Page;
  readonly popupTitle: Locator;
  readonly closePopupButton: Locator;
  readonly loginLink: Locator;
  readonly allDepartmentsLabel: Locator;
  readonly cartLink: Locator;
  readonly blockUI: Locator;

  constructor(page: Page) {
    this.page = page;
    this.popupTitle = this.page.getByTestId("pum-5700");
    this.closePopupButton = this.page.getByRole("button", { name: "Close" });
    this.loginLink = this.page.getByRole("link", { name: "Log in / Sign up" });
    this.allDepartmentsLabel = this.page.getByText("All Departments");
    this.cartLink = this.page.locator(".cart-type1 svg").first();
    this.blockUI = this.page.locator(".blockOverlay").last();
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
      .getByTestId("menu-all-departments-1")
      .getByRole("link", { name: departmentName });
    await departmentLink.scrollIntoViewIfNeeded();
    await departmentLink.click();
  }

  async navigateTo(menuName: string) {
    await this.page
      .getByTestId("menu-main-menu-1")
      .getByRole("link", { name: menuName })
      .click();

    await this.page.waitForLoadState("domcontentloaded");
  }

  async waitForBlockUIToDisappear() {
    await this.blockUI.waitFor({ state: "visible", timeout: 2000 });
    await this.blockUI.waitFor({ state: "detached", timeout: 10000 });
  }
}
