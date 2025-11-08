import { expect, type Locator, type Page } from "@playwright/test";
import { BasePage } from "./base.ts";
import { Menu } from "../type/menu.type.ts";
import type { AccountMenu } from "../type/acount.menu.type.ts";
import type { CustomerInfo } from "../models/customer.info.ts";

export class AccountPage extends BasePage {
    readonly logoutLink: Locator;
    // Billing address fields
    readonly firstNameField: Locator;
    readonly lastNameField: Locator;
    readonly companyField: Locator;
    readonly emailField: Locator;
    readonly phoneField: Locator;
    readonly countryField: Locator;
    readonly addressField: Locator;
    readonly cityField: Locator;
    readonly stateField: Locator;
    readonly zipField: Locator;
    readonly saveAddressButton: Locator;
    readonly successMessage: Locator;

    // State name to code mapping
    private stateMapping: { [key: string]: string } = {
        'California': 'CA',
        'New York': 'NY',
        'Texas': 'TX',
        'Florida': 'FL',
        // Add more states as needed
    };

    constructor(page: Page) {
        super(page);
        this.logoutLink = this.page.getByRole('link', { name: 'Logout' });
        this.firstNameField = this.page.getByRole('textbox', { name: 'First Name' });
        this.lastNameField = this.page.getByRole('textbox', { name: 'Last Name' });
        this.companyField = this.page.getByRole('textbox', { name: 'Company Name' });
        this.emailField = this.page.getByTestId('billing_email');
        this.phoneField = this.page.getByRole('textbox', { name: 'Phone' });
        this.countryField = this.page.getByTestId('select2-chosen-1');
        this.addressField = this.page.getByRole('textbox', { name: 'Address *', exact: true });
        this.cityField = this.page.getByRole('textbox', { name: 'Town / City' });
        this.stateField = this.page.getByTestId('select2-chosen-2');
        this.zipField = this.page.getByRole('textbox', { name: 'ZIP' });
        this.saveAddressButton = this.page.getByRole('button', { name: 'Save Address' });
        this.successMessage = this.page.getByText('Address changed successfully.');
    }

    async navigateTo(accountMenu: AccountMenu) {
        await this.page.getByRole('link', { name: accountMenu, exact: true }).click();
    }

    async edit(fieldName: string) {
        await this.page.getByRole('banner').filter({ hasText: `${fieldName} Edit` }).getByRole('link').click();
    }

    async fillBillingAddress(customerInfo: CustomerInfo) {
        await this.firstNameField.fill(customerInfo.firstName);
        await this.lastNameField.fill(customerInfo.lastName);
        if (customerInfo.companyName) {
            await this.companyField.fill(customerInfo.companyName);
        }
        await this.emailField.fill(customerInfo.email);
        await this.phoneField.fill(customerInfo.phone);

        await this.countryField.click();
        await this.page.getByRole('combobox', { name: 'Country' }).fill(customerInfo.country);
        await this.page.getByRole('option', { name: customerInfo.country, exact: true }).locator('span').click();

        await this.addressField.fill(customerInfo.address);
        await this.cityField.fill(customerInfo.city);

        await this.stateField.scrollIntoViewIfNeeded();
        await this.stateField.click();
        await this.page.getByRole('combobox', { name: 'State' }).fill(customerInfo.state);
        await this.page.getByRole('option', { name: customerInfo.state, exact: true }).click();

        await this.zipField.fill(customerInfo.zip);
    }

    async editCustomerInfo(customerInfo: CustomerInfo) {
        await this.fillBillingAddress(customerInfo);
        await this.saveAddressButton.click();

    }

    async shouldUpdateSuccessMessageDisplay() {
        await expect(this.successMessage).toBeVisible();
    }

    async shouldBillingAddressUpdateSuccess(customerInfo: CustomerInfo) {
        await expect(this.page.getByText(`${customerInfo.firstName} ${customerInfo.lastName}`)).toBeVisible();
        await expect(this.page.getByText(customerInfo.companyName || '')).toBeVisible();
        await expect(this.page.getByText(customerInfo.address)).toBeVisible();
        await expect(this.page.getByText(`${customerInfo.city}, ${stateMap[customerInfo.state]} ${customerInfo.zip}`)).toBeVisible();
        await expect(this.page.getByText(customerInfo.country)).toBeVisible();

    }

    async shouldMyAccountPageDisplay(username: string) {
        await expect(this.page).toHaveURL(/.*my-account/);
        await this.shouldBeOnPage(Menu.MY_ACCOUNT);
        await expect(this.page.getByText(`Hello ${username} (not ${username}? Sign out)`)).toBeVisible();
        await this.shouldLogoutLinkBeVisible();
    }

    async shouldLogoutLinkBeVisible() {
        await expect(this.logoutLink).toBeVisible();
    }

    async logout() {
        await this.logoutLink.click();
    }


}

const stateMap: Record<string, string> = {
    "California": "CA",
    "New York": "NY",
    "Texas": "TX",
    "Florida": "FL",
};