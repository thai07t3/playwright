import type { Page } from "@playwright/test";
import { BasePage } from "./base.ts";

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
}
