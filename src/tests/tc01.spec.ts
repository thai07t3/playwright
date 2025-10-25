import { test } from "../fixtures/test.context.ts";
import { Department } from "../type/all.deparments.ts";

test.describe("E-commerce Test Cases", () => {
  test(
    "TC01: Single Item Purchase Flow",
    {
      tag: ["@smoke"],
    },
    async ({ loginPage, shopPage, cartPage, checkoutPage, customerInfo }) => {
      // 2-7: Navigate to product category and verify views
      await loginPage.selectDepartment(
        Department.Electronic_Components_Supplies,
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
    },
  );
});
