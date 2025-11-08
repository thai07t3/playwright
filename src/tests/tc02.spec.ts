import { test } from "../fixtures/fixture.ts";
import { AccountMenu } from "../type/acount.menu.type.ts";
import { AddressType } from "../type/address.type.ts";
import { Menu } from "../type/menu.type.ts";

test.describe("Update Address", () => {
  test(
    "TC02: Verify User Can Update Billing Address",
    {
      tag: ["@smoke", "@regression"],
    },
    async ({ homePage, registerPage, accountPage, customerInfo }) => {
      const username = process.env.USERNAME || "";
      const password = process.env.PASSWORD || "";

      await homePage.goTo(Menu.MY_ACCOUNT);
      await registerPage.login(username, password);

      await accountPage.navigateTo(AccountMenu.ADDRESSES);
      await accountPage.edit(AddressType.BILLING);
      await accountPage.editCustomerInfo(customerInfo);
      await accountPage.shouldUpdateSuccessMessageDisplay();

      await accountPage.navigateTo(AccountMenu.ADDRESSES);
      await accountPage.shouldBillingAddressUpdateSuccess(customerInfo);
    },
  );
});
