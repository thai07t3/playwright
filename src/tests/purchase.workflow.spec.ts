import { test } from "../fixtures/test.context.ts";
import { LoginPage } from "../page/login.ts";
import { Department } from "../type/deparments.type.ts";
import { Menu } from "../type/menu.type.ts";
import { Payment } from "../type/payment.type.ts";

test.describe("E-commerce Test Cases", () => {
  test(
    "TC01: Single Item Purchase Flow",
    {
      tag: ["@smoke", "@regression"],
    },
    async ({ loginPage, shopPage, cartPage, checkoutPage, customerInfo }) => {
      // 2-7: Navigate to product category and verify views
      await loginPage.selectDepartment(
        Department.ELECTRONIC_COMPONENTS_SUPPLIES,
      );
      await shopPage.shouldBeInGridView();
      await shopPage.switchToListView();
      await shopPage.shouldBeInListView();

      // 8-11: Add random item to cart and verify in cart
      const selectedProduct = await shopPage.addRandomItemToCart();
      await shopPage.goToCart();
      await cartPage.shouldCartContain([selectedProduct]);

      //12-14: Proceed to checkout and verify order
      await cartPage.checkout();
      await checkoutPage.shouldCheckoutPageDisplay();
      await checkoutPage.shouldProductInCheckout(
        selectedProduct.name,
        selectedProduct.price.toString(),
      );

      // 15-17: Fill in customer information and place order
      await checkoutPage.fillBillingInformation(customerInfo);
      await checkoutPage.placeOrder();
      await checkoutPage.shouldShowOrderConfirmation();

      //Reset switches after test
      await checkoutPage.navigateTo(Menu.SHOP);
      await shopPage.switchToGridView();
    },
  );

  test(
    "TC02: Multiple Items Purchase Flow",
    {
      tag: ["@regression"],
    },
    async ({ loginPage, shopPage, cartPage, checkoutPage, customerInfo }) => {
      // 3-4: Select multiple items and add to cart
      await loginPage.navigateTo(Menu.SHOP);
      const selectedProducts = await shopPage.addMultipleItemsToCart();
      await shopPage.goToCart();
      await cartPage.shouldCartContain(selectedProducts);

      // 5-7: Verify items in cart and proceed to checkout
      await cartPage.checkout();
      await checkoutPage.shouldMultiProductsInCheckout(selectedProducts);
      await checkoutPage.fillBillingInformation(customerInfo);
      await checkoutPage.placeOrder();
      await checkoutPage.shouldShowOrderConfirmation();
    },
  );

  for (const payment of Object.values(Payment)) {
    test(
      `TC03: Payment Method With "${payment}"`,
      {
        tag: ["@regression"],
      },
      async ({ loginPage, shopPage, cartPage, checkoutPage, customerInfo }) => {
        // 3-4: Navigate to shop and add random item to cart
        await loginPage.navigateTo(Menu.SHOP);
        await shopPage.addRandomItemToCart();

        // 5-8: Go to cart and proceed to checkout
        await shopPage.goToCart();
        await cartPage.checkout();
        await checkoutPage.fillBillingInformation(customerInfo);
        await checkoutPage.selectPaymentMethod(payment);
        await checkoutPage.placeOrder();
        await checkoutPage.shouldShowOrderConfirmation();
      },
    );
  }

  // Override test to setup guest user purchase flow
  test.extend({
    loginPage: async ({ page, homePage }, use) => {
      const loginPage = new LoginPage(page);
      await page.goto(process.env.URL || "/");
      await homePage.closePopupIfPresent();
      await use(loginPage);
    },
  })(
    "TC06: Guest User Can Purchase",
    {
      tag: ["@regression"],
    },
    async ({ loginPage, shopPage, cartPage, checkoutPage, customerInfo }) => {
      // 3-4: Select a random item and add to cart (as guest user without login)
      await loginPage.navigateTo(Menu.SHOP);
      const selectedProduct = await shopPage.addRandomItemToCart();
      await shopPage.goToCart();

      // 5: Proceed to complete order as guest user
      await cartPage.checkout();
      await checkoutPage.shouldMultiProductsInCheckout([selectedProduct]);
      await checkoutPage.fillBillingInformation(customerInfo);
      await checkoutPage.placeOrder();
      await checkoutPage.shouldShowOrderConfirmation();
    },
  );
});
