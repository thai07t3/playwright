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
import { AccountPage } from "../page/account.ts";
import { ProductDetailPage } from "../page/product.detail.ts";

type Pages = {
  homePage: HomePage;
  loginPage: LoginPage;
  accountPage: AccountPage;
  shopPage: ShopPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  user: User;
  customerInfo: CustomerInfo;
  productDetails: ProductDetailPage;
};

export const test = base.extend<Pages>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  loginPage: async ({ page, homePage }, use) => {
    const loginPage = new LoginPage(page);
    await page.goto(process.env.URL || "/");
    await homePage.closePopupIfPresent();
    await homePage.goToLogin();
    await use(loginPage);
  },

  accountPage: async ({ page, loginPage, user }, use) => {
    const accountPage = new AccountPage(page);
    await loginPage.login(user);
    await use(accountPage);
  },

  shopPage: async ({ page }, use) => {
    await use(new ShopPage(page));
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

  productDetails: async ({ page }, use) => {
    await use(new ProductDetailPage(page));
  },
});
