import { expect, type Page } from "@playwright/test";
import type { Menu } from "../type/menu.type.ts";

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goTo(menuName: Menu) {
    await this.page.getByRole('link', { name: menuName }).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async shouldBeOnPage(menuName: Menu) {
    const menuLink = this.page.getByRole('link', { name: menuName });
    await expect(menuLink).toHaveCSS('color', 'rgb(237, 30, 36)');
  }
}