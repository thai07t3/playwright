import { test } from '@playwright/test';
import { HomePage } from '../page/home.ts';
import { LoginPage } from '../page/login.ts';
import { ProductPage } from '../page/product.ts';
import { Account } from '../page/account.ts';

test('test', async ({ page }) => {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);
  const accountPage = new Account(page);
  const productPage = new ProductPage(page);
  
  const username = process.env.USERNAME || 'username';
  const password = process.env.PASSWORD || 'password';
  
  await page.goto(process.env.URL || 'https://demo.testarchitect.com/');
  await homePage.closePopupIfPresent();
  await homePage.navigateToLogin();
  await loginPage.login(username, password);
  await accountPage.selectDepartment("Electronic Components & Supplies");
  await productPage.shouldBeInGridView();
  await productPage.switchViewTo('list');
  await productPage.shouldBeInListView();
  const selectedProduct = await productPage.selectRandomItem();
  console.log('Selected Product Info:', selectedProduct);
  console.log('Test completed successfully.');
});