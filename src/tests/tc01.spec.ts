import { test } from '../fixtures/test-context.ts';

test.describe('E-commerce Test Cases', () => {
  test.beforeEach(async ({ page, homePage, loginPage }) => {
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
    // Clear cart after each test to prevent contamination
    await cartPage.clearCart();
  });

  test('TC01: Single Item Purchase Flow', {
    tag: ["@smoke"]
  }, async ({ homePage, productPage, cartPage }) => {

    await homePage.selectDepartment("Electronic Components & Supplies");
    // await page.waitForLoadState('networkidle');

    // Verify views switching
    await productPage.switchToGridView();
    await productPage.shouldBeInGridView();
    await productPage.switchToListView();
    await productPage.shouldBeInListView();

    // Steps 8-9: Select item and add to cart
    const availableCount = await productPage.getAvailableItemsCount();
    const randomIndex = Math.floor(Math.random() * availableCount);
    const selectedProduct = await productPage.getProductInfoByIndex(randomIndex);
    await productPage.addRandomItemToCart();

    // Steps 10-11: Go to cart and verify item details
    if (selectedProduct) {
      await cartPage.verifyCartContents([selectedProduct]);
    }

    // Display final summary
    await cartPage.verifyCartSummary();
  });

  // test('TC02: Multiple Items Purchase Flow', {
  //   tag: ["@regression"]
  // }, async ({ page, homePage, loginPage, accountPage, productPage, cartPage }) => {

  //   // Steps 1-2: Open browser and login
  //   await page.goto('https://demo.testarchitect.com/');
  //   await loginPage.login(process.env.USERNAME || 'thai.luu@agest.vn', process.env.PASSWORD || '6j4gX3sTVz4NmYQ');
  //   await page.waitForLoadState('networkidle');

  //   // Navigate to Shop page
  //   await homePage.goToShop();

  //   // Step 3: Go to Shop page (navigate to department)
  //   await homePage.selectDepartment("Electronic Components & Supplies");
  //   await page.waitForLoadState('networkidle');

  //   // Verify views switching
  //   await productPage.switchToGridView();
  //   await productPage.shouldBeInGridView();
  //   await productPage.switchToListView();
  //   await productPage.shouldBeInListView();

  //   // Step 4: Select multiple items and add to cart
  //   const selectedProducts = [];
  //   const availableCount = await productPage.getAvailableItemsCount();
  //   const itemCount = Math.min(2, availableCount);

  //   for (let i = 0; i < itemCount; i++) {
  //     const randomIndex = Math.floor(Math.random() * availableCount);
  //     const productInfo = await productPage.getProductInfoByIndex(randomIndex);
  //     if (productInfo) {
  //       await productPage.addRandomItemToCart();
  //       selectedProducts.push(productInfo);
  //       await page.waitForTimeout(1000); // Wait between additions
  //     }
  //   }

  //   // Step 5: Go to cart and verify all selected items
  //   if (selectedProducts.length > 0) {
  //     await cartPage.verifyCartContents(selectedProducts);
  //   }

  //   // Display final summary
  //   await cartPage.verifyCartSummary();

  //   console.log('✓ TC02: Multiple Items Purchase Flow completed successfully');
  // });
});