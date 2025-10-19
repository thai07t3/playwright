import { test as base } from '@playwright/test';
import { HomePage } from '../page/home.ts';
import { LoginPage } from '../page/login.ts';
import { ProductPage } from '../page/product.ts';
import { Account } from '../page/account.ts';
import { CartPage } from '../page/cart.ts';

type Pages = {
    homePage: HomePage;
    loginPage: LoginPage;
    accountPage: Account;
    productPage: ProductPage;
    cartPage: CartPage;
};

export const test = base.extend<Pages>({
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },

    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    accountPage: async ({ page }, use) => {
        await use(new Account(page));
    },

    productPage: async ({ page }, use) => {
        await use(new ProductPage(page));
    },

    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },
});

export { expect } from '@playwright/test';