import { test as base } from '@playwright/test';
import { HomePage } from '../page/home.ts';
import { LoginPage } from '../page/login.ts';
import { ProductPage } from '../page/product.ts';
import { CartPage } from '../page/cart.ts';
import { CheckoutPage } from '../page/checkout.ts';
import { CustomerRepository, CustomerInfo } from '../models/customerInfo.ts';

export type User = {
    username: string;
    password: string;
}

type Pages = {
    homePage: HomePage;
    loginPage: LoginPage;
    productPage: ProductPage;
    cartPage: CartPage;
    checkoutPage: CheckoutPage;
    user: User;
    customerInfo: CustomerInfo;
};

export const test = base.extend<Pages>({
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },

    loginPage: async ({ page, homePage, user }, use) => {
        const loginPage = new LoginPage(page);
        await page.goto(process.env.URL || '/');
        await homePage.closePopupIfPresent();
        await homePage.goToLogin();
        await loginPage.login(user);
        await use(loginPage);
    },

    productPage: async ({ page }, use) => {
        await use(new ProductPage(page));
    },

    cartPage: async ({ page }, use) => {
        const cartPage = new CartPage(page);
        await use(cartPage);
        await cartPage.clearCart();
    },

    checkoutPage: async ({ page }, use) => {
        await use(new CheckoutPage(page));
    },

    user: async ({ }, use) => {
        const user: User = {
            username: process.env.USERNAME || 'thai.luu@agest.vn',
            password: process.env.PASSWORD || '6j4gX3sTVz4NmYQ'
        };
        await use(user);
    },

    customerInfo: async ({ }, use) => {
        // Load customer data from JSON file
        const customerInfo = CustomerRepository.loadCustomer();
        await use(customerInfo);
    },
});