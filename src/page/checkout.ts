import { expect, type Locator, type Page } from "@playwright/test";
import { HomePage } from "./home.ts";
import { CustomerInfo } from "../models/customer.info.ts";
import { CheckoutTable } from "../table/checkout.table.ts";
import type { Product } from "../models/product.ts";
import { Order } from "../models/order.ts";
import { checkoutValidationErrors } from "../data/validation-errors.ts";

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
  readonly alertLabel: Locator;

  // Action buttons
  readonly placeOrderButton: Locator;
  readonly orderConfirmationMessage: Locator;

  //Order Info
  readonly orderInfo: Locator;
  readonly orderNumber: Locator;
  readonly orderDate: Locator;
  readonly orderEmail: Locator;
  readonly orderTotal: Locator;
  readonly orderPaymentMethod: Locator;

  constructor(page: Page) {
    super(page);
    this.billingLabel = this.page.getByText("Billing Details", { exact: true });
    this.yourOrderTitle = this.page.getByText("Your order", { exact: true });
    this.checkoutTable = new CheckoutTable(page);

    // Initialize form field locators
    this.firstNameField = this.page.getByTestId("billing_first_name");
    this.lastNameField = this.page.getByTestId("billing_last_name");
    this.companyField = this.page.getByTestId("billing_company");
    this.countrySelect = this.page.getByTestId("billing_country");
    this.addressField = this.page.getByPlaceholder(
      "House number and street name",
    );
    this.apartmentField = this.page.getByTestId("billing_address_2");
    this.postcodeField = this.page.getByTestId("billing_postcode");
    this.cityField = this.page.getByTestId("billing_city");
    this.stateField = this.page.getByTestId("select2-billing_state-container");
    this.phoneField = this.page.getByTestId("billing_phone");
    this.emailField = this.page.getByTestId("billing_email");
    this.orderNotesField = this.page.getByTestId("order_comments");
    this.alertLabel = this.page.getByRole("alert");
    this.placeOrderButton = this.page.getByRole("button", {
      name: /place order|complete order/i,
    });
    this.orderConfirmationMessage = this.page.getByText(
      "Thank you. Your order has been received",
    );

    //Order Info
    this.orderInfo = this.page.getByRole("list");
    this.orderNumber = this.orderInfo.getByText("Order number:");
    this.orderDate = this.orderInfo.getByText("Date:");
    this.orderEmail = this.orderInfo.getByText("Email:");
    this.orderTotal = this.orderInfo.getByText("Total:");
    this.orderPaymentMethod = this.orderInfo.getByText("Payment method:");
  }

  async shouldCheckoutPageDisplay() {
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

    // Handle Select2 dropdown by clicking and selecting option
    await this.stateField.click();
    await this.page
      .getByText(customerInfo.state, { exact: true })
      .last()
      .click();

    // Fill contact information
    await this.phoneField.fill(customerInfo.phone);
    await this.emailField.fill(customerInfo.email);

    // Fill order notes if provided
    if (customerInfo.orderNotes) {
      await this.orderNotesField.fill(customerInfo.orderNotes);
    }
  }

  async clearBillingInformation() {
    await this.firstNameField.clear();
    await this.lastNameField.clear();
    await this.addressField.clear();
    await this.postcodeField.clear();
    await this.cityField.clear();
    await this.phoneField.clear();
    await this.emailField.clear();
  }

  async shouldProductInCheckout(productName: string, productPrice: string) {
    await this.checkoutTable.shouldProductInCheckout(productName, productPrice);
  }

  async shouldMultiProductsInCheckout(products: Product[]) {
    for (const product of products) {
      await this.checkoutTable.shouldProductInCheckout(
        product.name,
        product.price.toString(),
      );
    }
  }

  async selectPaymentMethod(methodName: string) {
    const paymentMethodRadio = this.page.getByLabel(methodName);
    await paymentMethodRadio.click();
  }

  async placeOrder() {
    await this.placeOrderButton.click();
  }

  async shouldShowOrderConfirmation() {
    await this.waitForBlockUIToDisappear();
    await expect(this.orderConfirmationMessage).toBeVisible({ timeout: 10000 });
  }

  async shouldShowAlert() {
    await expect(this.alertLabel).toBeVisible();
    const expectedErrors = checkoutValidationErrors;
    for (const error of expectedErrors) {
      await expect(this.alertLabel).toContainText(error);
    }
  }

  async shouldHighlightMandatoryFields() {
    const mandatoryFields = [
      this.firstNameField,
      this.lastNameField,
      this.addressField,
      this.cityField,
      this.postcodeField,
      this.phoneField,
      this.emailField,
    ];

    for (const field of mandatoryFields) {
      await expect(field).toHaveCSS(
        "border-color",
        /rgb\(198,\s*40,\s*40\)|rgb\(198, 40, 40\)/,
      );
    }
  }

  async getOrderInformation(): Promise<Order> {
    const orderNumberText = await this.orderNumber.textContent();
    const dateText = await this.orderDate.textContent();
    const emailText = await this.orderEmail.textContent();
    const totalText = await this.orderTotal.textContent();
    const paymentMethodText = await this.orderPaymentMethod.textContent();

    return Order.fromOrderOverview(
      orderNumberText || "",
      dateText || "",
      emailText || "",
      totalText || "",
      paymentMethodText || "",
    );
  }
}
