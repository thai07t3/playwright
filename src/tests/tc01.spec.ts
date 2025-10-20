import { test } from '../fixtures/test-context.ts';
import { CustomerInfo } from '../models/CustomerInfo.ts';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

    await cartPage.clearCart();
  });

  // Note: Cart clearing moved to beforeEach to prevent interference with checkout flow

  test('TC01: Single Item Purchase Flow', {
    tag: ["@smoke"]
  }, async ({ homePage, productPage, cartPage, checkoutPage }) => {
    await homePage.selectDepartment("Electronic Components & Supplies");
    await homePage.page.waitForLoadState('domcontentloaded');

    // Verify views switching
    // await productPage.shouldBeInGridView();
    // await productPage.switchToListView();
    // await productPage.shouldBeInListView();

    // Steps 8-9: Select item and add to cart
    const selectedProduct = await productPage.addRandomItemToCart();
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

    // Load customer data from JSON file
    const customerDataPath = path.join(process.cwd(), 'data/customer.json');
    const customerData = JSON.parse(fs.readFileSync(customerDataPath, 'utf-8'));
    const customerInfo = CustomerInfo.createCustomer(customerData);

    // Fill in customer information
    await checkoutPage.fillBillingInformation(customerInfo);
    await checkoutPage.placeOrder();
    await checkoutPage.shouldShowOrderConfirmation();
  });
});