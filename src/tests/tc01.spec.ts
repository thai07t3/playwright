import { test } from '../fixtures/test-context.ts';
import { CustomerRepository } from '../models/CustomerInfo.ts';

test.describe('E-commerce Test Cases', () => {
  test.beforeEach(async ({ page, homePage, loginPage, cartPage }) => {
    // Navigate to the application URL
    await page.goto(process.env.URL || 'https://demo.testarchitect.com/');
    await homePage.closePopupIfPresent();

    await homePage.goToLogin();

    // Perform login before each test
    await loginPage.login(
      process.env.USERNAME || 'thai.luu@agest.vn',
      process.env.PASSWORD || '6j4gX3sTVz4NmYQ'
    );
  });

  test.afterEach(async ({ cartPage }) => {
    await cartPage.clearCart();
  });

  test('TC01: Single Item Purchase Flow', {
    tag: ["@smoke"]
  }, async ({ homePage, productPage, cartPage, checkoutPage }) => {
    await homePage.selectDepartment("Electronic Components & Supplies");
    await homePage.page.waitForLoadState('domcontentloaded');

    // Verify views switching
    // await productPage.shouldBeInGridView();
    await productPage.switchToListView();
    await productPage.shouldBeInListView();

    // Steps 8-9: Select item and add to cart
    const selectedProduct = await productPage.addRandomItemToCart();
    await productPage.page.waitForLoadState('networkidle');
    await productPage.page.waitForTimeout(2000);
    await productPage.goToCart();

    // Steps 10-11: Go to cart and verify item details
    if (selectedProduct) {
      await cartPage.shouldCartContain([selectedProduct]);
    }

    await cartPage.checkout();
    await checkoutPage.shouldCheckoutPageDisplayed();
    if (selectedProduct) {
      await checkoutPage.shouldProductInCheckout(
        selectedProduct.getName,
        selectedProduct.getPrice.toString()
      );
    }

    // Load customer data using CustomerRepository
    const customerInfo = CustomerRepository.loadCustomer();

    // Fill in customer information
    await checkoutPage.fillBillingInformation(customerInfo);
    await checkoutPage.placeOrder();
    await checkoutPage.shouldShowOrderConfirmation();
  });
});