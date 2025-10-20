import { expect, type Locator, type Page } from "@playwright/test";
import { HomePage } from "./home.ts";
import { CustomerInfo } from "../models/CustomerInfo.ts";
import { CheckoutTable } from "../table/checkoutTable.ts";

export class CheckoutPage extends HomePage {
    readonly billingLabel: Locator;
    readonly yourOrderTitle: Locator;
    readonly checkoutTable: CheckoutTable;

    // Billing form fields
    readonly firstNameField: Locator;
    readonly lastNameField: Locator;
    readonly companyField: Locator;
    readonly countrySelect: Locator;
    readonly addressField: Locator;
    readonly apartmentField: Locator;
    readonly postcodeField: Locator;
    readonly cityField: Locator;
    readonly stateField: Locator;
    readonly phoneField: Locator;
    readonly emailField: Locator;
    readonly orderNotesField: Locator;

    // Action buttons
    readonly placeOrderButton: Locator;
    readonly orderConfirmationMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.billingLabel = this.page.getByText('Billing Details', { exact: true });
        this.yourOrderTitle = this.page.getByText("Your order", { exact: true });
        this.checkoutTable = new CheckoutTable(page);

        // Initialize form field locators
        this.firstNameField = this.page.getByTestId('billing_first_name');
        this.lastNameField = this.page.getByTestId('billing_last_name');
        this.companyField = this.page.getByTestId('billing_company');
        this.countrySelect = this.page.getByTestId('billing_country');
        this.addressField = this.page.getByPlaceholder('House number and street name');
        this.apartmentField = this.page.getByTestId('billing_address_2');
        this.postcodeField = this.page.getByTestId('billing_postcode');
        this.cityField = this.page.getByTestId('billing_city');
        this.stateField = this.page.getByTestId('select2-billing_state-container')
        this.phoneField = this.page.getByTestId('billing_phone');
        this.emailField = this.page.getByTestId('billing_email');
        this.orderNotesField = this.page.getByTestId('order_comments');

        this.placeOrderButton = this.page.getByRole('button', { name: /place order|complete order/i });
        this.orderConfirmationMessage = this.page.getByText('Thank you. Your order has been received');
    }

    async shouldCheckoutPageDisplayed() {
        await expect(this.billingLabel).toBeVisible();
        await expect(this.yourOrderTitle).toBeVisible();
    }

    async fillBillingInformation(customerInfo: CustomerInfo) {
        // Fill required fields
        await this.firstNameField.fill(customerInfo.firstName);
        await this.lastNameField.fill(customerInfo.lastName);

        // Fill optional company field if provided
        if (customerInfo.companyName) {
            await this.companyField.fill(customerInfo.companyName);
        }

        // Select country
        await this.countrySelect.selectOption(customerInfo.country);
        await this.page.waitForLoadState('networkidle');

        // Fill address fields
        await this.addressField.fill(customerInfo.streetAddress);
        if (customerInfo.apartment) {
            await this.apartmentField.fill(customerInfo.apartment);
        }

        // Fill postcode if provided (some countries don't require it)
        if (customerInfo.postcode) {
            await this.postcodeField.fill(customerInfo.postcode);
        }

        await this.cityField.fill(customerInfo.city);

        // Fill state if visible (only required for certain countries)
        if (await this.stateField.isVisible()) {
            // Handle Select2 dropdown by clicking and selecting option
            await this.stateField.click();
            await this.page.getByText(customerInfo.state, { exact: true }).last().click();
            await this.page.waitForLoadState('networkidle');
        }

        // Fill contact information
        await this.phoneField.fill(customerInfo.phone);
        await this.emailField.fill(customerInfo.email);

        // Fill order notes if provided
        if (customerInfo.orderNotes) {
            await this.orderNotesField.fill(customerInfo.orderNotes);
        }
    }

    async shouldProductInCheckout(productName: string, productPrice: string) {
        await this.checkoutTable.verifyProductInCheckout(productName, productPrice);
    }

    async placeOrder() {
        await this.placeOrderButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000);
    }

    async shouldShowOrderConfirmation() {
        await expect(this.orderConfirmationMessage).toBeVisible();
    }
}