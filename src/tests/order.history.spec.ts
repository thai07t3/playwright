import { test as test } from "../fixtures/test.context.ts";
import { Menu } from "../type/menu.type.ts";
import type { Order } from "../models/order.ts";
import { HomePage } from "../page/home.ts";
import { LoginPage } from "../page/login.ts";
import { ShopPage } from "../page/shop.ts";
import { CartPage } from "../page/cart.ts";
import { CheckoutPage } from "../page/checkout.ts";

test.describe("Order History Verification", () => {
  const placedOrders: Order[] = [];

  test.beforeAll(
    "Setup: Place 2 orders as pre-condition",
    async ({ browser, user, customerInfo }) => {
      const context = await browser.newContext();
      const page = await context.newPage();

      // Initialize page objects
      const homePage = new HomePage(page);
      const loginPage = new LoginPage(page);
      const shopPage = new ShopPage(page);
      const cartPage = new CartPage(page);
      const checkoutPage = new CheckoutPage(page);

      // User login
      await page.goto(process.env.URL || "/");
      await homePage.closePopupIfPresent();
      await homePage.goToLogin();
      await loginPage.login(user);

      // Place first order
      await homePage.navigateTo(Menu.SHOP);
      await shopPage.addRandomItemToCart();
      await shopPage.goToCart();
      await cartPage.checkout();
      await checkoutPage.fillBillingInformation(customerInfo);
      await checkoutPage.placeOrder();

      const order1 = await checkoutPage.getOrderInformation();
      placedOrders.push(order1);

      // Place second order
      await homePage.navigateTo(Menu.SHOP);
      await shopPage.addRandomItemToCart();
      await shopPage.goToCart();
      await cartPage.checkout();
      await checkoutPage.fillBillingInformation(customerInfo);
      await checkoutPage.placeOrder();

      const order2 = await checkoutPage.getOrderInformation();
      placedOrders.push(order2);
      await context.close();
    },
  );

  test(
    "TC05: Verify orders appear in order history",
    {
      tag: ["@smoke", "@regression"],
    },
    async ({ accountPage }) => {
      await accountPage.navigateToOrders();
      await accountPage.shouldHaveSpecificOrdersInHistory(placedOrders);
    },
  );
});
