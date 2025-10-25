import { test as base } from "@playwright/test";
import { HomePage } from "../page/home.ts";
import { LoginPage } from "../page/login.ts";
import { ShopPage } from "../page/shop.ts";
import { CartPage } from "../page/cart.ts";
import { CheckoutPage } from "../page/checkout.ts";
import {
  CustomerRepository,
  CustomerInfo,
  getUser,
  type User,
} from "../models/customer.info.ts";
import { Department } from "../type/all.deparments.ts";

type Pages = {
  homePage: HomePage;
  loginPage: LoginPage;
  shopPage: ShopPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  user: User;
  customerInfo: CustomerInfo;
};

export const test = base.extend<Pages>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  loginPage: async ({ page, homePage, user }, use) => {
    const loginPage = new LoginPage(page);
    await page.goto(process.env.URL || "/");
    await homePage.closePopupIfPresent();
    await homePage.goToLogin();
    await loginPage.login(user);
    await use(loginPage);
  },

  shopPage: async ({ page, loginPage }, use) => {
    const shopPage = new ShopPage(page);
    await use(shopPage);
    await loginPage.selectDepartment(Department.Electronic_Components_Supplies);
    await shopPage.switchToGridView();
  },

  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
    await cartPage.clearCart();
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  user: getUser(),

  customerInfo: CustomerRepository.loadCustomer(),
});
