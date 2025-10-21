import { test } from '../fixtures/test.context.ts';
import { DEFAULT_TEST_DEPARTMENT } from '../constants/departments.ts';

test.describe('E-commerce Test Cases', () => {
  test('TC01: Single Item Purchase Flow', {
    tag: ["@smoke"]
  }, async ({ loginPage, productPage, cartPage, checkoutPage, customerInfo }) => {
    // 2-7: Navigate to product category and verify views
    await loginPage.selectDepartment(DEFAULT_TEST_DEPARTMENT);
    await productPage.shouldBeInGridView();
    await productPage.switchToListView();
    await productPage.shouldBeInListView();

    // 8-11: Add random item to cart and verify in cart
    const selectedProduct = await productPage.addRandomItemToCart();
    await productPage.goToCart();
    await cartPage.shouldCartContain([selectedProduct]);

    //12-14: Proceed to checkout and verify order
    await cartPage.checkout();
    await checkoutPage.shouldCheckoutPageDisplayed();
    await checkoutPage.shouldProductInCheckout(
      selectedProduct.getName,
      selectedProduct.getPrice.toString()
    );

    // 15-17: Fill in customer information and place order
    await checkoutPage.fillBillingInformation(customerInfo);
    await checkoutPage.placeOrder();
    await checkoutPage.shouldShowOrderConfirmation();
  });
});