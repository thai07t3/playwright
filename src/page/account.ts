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

  constructor(page: Page) {
    super(page);
    this.logoutLink = this.page.getByRole("link", { name: "Logout" });
    this.firstNameField = this.page.getByRole("textbox", {
      name: "First Name",
    });
    this.lastNameField = this.page.getByRole("textbox", { name: "Last Name" });
    this.companyField = this.page.getByRole("textbox", {
      name: "Company Name",
    });
    this.emailField = this.page.getByTestId("billing_email");
    this.phoneField = this.page.getByRole("textbox", { name: "Phone" });
    this.countryField = this.page.getByTestId("select2-chosen-1");
    this.addressField = this.page.getByRole("textbox", {
      name: "Address *",
      exact: true,
    });
    this.cityField = this.page.getByRole("textbox", { name: "Town / City" });
    this.stateField = this.page.getByTestId("select2-chosen-2");
    this.zipField = this.page.getByRole("textbox", { name: "ZIP" });
    this.saveAddressButton = this.page.getByRole("button", {
      name: "Save Address",
    });
    this.successMessage = this.page.getByText("Address changed successfully.");
  }

  async navigateTo(accountMenu: AccountMenu) {
    await this.page
      .getByRole("link", { name: accountMenu, exact: true })
      .click();
  }

  async edit(fieldName: string) {
    await this.page
      .getByRole("banner")
      .filter({ hasText: `${fieldName} Edit` })
      .getByRole("link")
      .click();
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
    await this.page
      .getByRole("combobox", { name: "Country" })
      .fill(customerInfo.address.country);
    await this.page
      .getByRole("option", { name: customerInfo.address.country, exact: true })
      .locator("span")
      .click();

    await this.addressField.fill(customerInfo.address.address);
    await this.cityField.fill(customerInfo.address.city);

    // Handle state/region/prefecture field - can be dropdown or textbox depending on country
    try {
      // First try to find any state-related dropdown
      const stateDropdownSelectors = [
        'getByTestId("select2-chosen-2")', // US States
        'getByText("Select an option…")', // Japan Prefectures
        'getByRole("button").filter({ hasText: /state|region|prefecture/i })',
      ];

      let stateDropdown = null;
      for (const selector of stateDropdownSelectors) {
        try {
          if (selector.includes("getByTestId")) {
            stateDropdown = this.page.getByTestId("select2-chosen-2");
          } else if (selector.includes("Select an option")) {
            stateDropdown = this.page.getByText("Select an option…");
          } else {
            stateDropdown = this.page
              .getByRole("button")
              .filter({ hasText: /state|region|prefecture/i });
          }
          await stateDropdown.waitFor({ state: "visible", timeout: 1000 });
          break; // Found working dropdown
        } catch (e) {
          stateDropdown = null; // Continue to next selector
        }
      }

      if (stateDropdown) {
        // Use dropdown logic
        await stateDropdown.scrollIntoViewIfNeeded();
        await stateDropdown.click();

        // Wait for dropdown options to appear
        await this.page.waitForSelector('[role="option"]', { timeout: 3000 });

        // Try to find matching option - be flexible with matching
        const stateOptions = await this.page
          .locator('[role="option"]')
          .allTextContents();
        const matchingOption = stateOptions.find(
          (option) =>
            option
              .toLowerCase()
              .includes(customerInfo.address.state.toLowerCase()) ||
            customerInfo.address.state
              .toLowerCase()
              .includes(option.toLowerCase()),
        );

        if (matchingOption) {
          await this.page
            .getByRole("option", { name: matchingOption, exact: true })
            .click();
        } else {
          // If no exact match, click first option as fallback
          await this.page.locator('[role="option"]').first().click();
        }
      } else {
        throw new Error("No dropdown found, trying textbox");
      }
    } catch (error) {
      // If dropdown doesn't work, try textbox approach
      try {
        const stateTextbox = this.page.getByRole("textbox", {
          name: /region|state|prefecture/i,
        });
        await stateTextbox.waitFor({ state: "visible", timeout: 2000 });
        await stateTextbox.scrollIntoViewIfNeeded();
        await stateTextbox.fill(customerInfo.address.state);
      } catch (textboxError) {
        console.warn("Could not fill state field:", error, textboxError);
        // Continue with the test even if state field fails
      }
    }

    await this.zipField.fill(customerInfo.address.postcode);
  }

  async editCustomerInfo(customerInfo: CustomerInfo) {
    await this.fillBillingAddress(customerInfo);
    await this.saveAddressButton.click();
  }

  async shouldUpdateSuccessMessageDisplay() {
    await expect(this.successMessage).toBeVisible();
  }

  async shouldBillingAddressUpdateSuccess(customerInfo: CustomerInfo) {
    await expect(
      this.page.getByText(`${customerInfo.firstName} ${customerInfo.lastName}`),
    ).toBeVisible();
    await expect(
      this.page.getByText(customerInfo.companyName || ""),
    ).toBeVisible();
    await expect(
      this.page.getByText(customerInfo.address.address),
    ).toBeVisible();
    await expect(
      this.page.getByText(`${customerInfo.address.city}`),
    ).toBeVisible();
    await expect(this.page.getByText(customerInfo.address.state)).toBeVisible();
    await expect(
      this.page.getByText(customerInfo.address.postcode),
    ).toBeVisible();
    await expect(
      this.page.getByText(customerInfo.address.country),
    ).toBeVisible();
  }

  async shouldMyAccountPageDisplay(username: string) {
    await expect(this.page).toHaveURL(/.*my-account/);
    await this.shouldBeOnPage(Menu.MY_ACCOUNT);
    await expect(
      this.page.getByText(`Hello ${username} (not ${username}? Sign out)`),
    ).toBeVisible();
    await this.shouldLogoutLinkBeVisible();
  }

  async shouldLogoutLinkBeVisible() {
    await expect(this.logoutLink).toBeVisible();
  }

  async logout() {
    await this.logoutLink.click();
  }
}
