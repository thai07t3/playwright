import { test as base } from "@playwright/test";
import { HomePage } from "../page/home.ts";
import { AccountPage } from "../page/account.ts";
import { RegisterPage } from "../page/register.ts";
import { CustomerInfo } from "../models/customer.info.ts";

type Pages = {
  homePage: HomePage;
  registerPage: RegisterPage;
  accountPage: AccountPage;
  customerInfo: CustomerInfo;
};

export const test = base.extend<Pages>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await page.goto(process.env.URL || "/");
    await use(homePage);
  },

  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },

  accountPage: async ({ page }, use) => {
    await use(new AccountPage(page));
  },

  customerInfo: async ({}, use) => {
    const customerInfo = await CustomerInfo.create();
    await use(customerInfo);
  },
});
