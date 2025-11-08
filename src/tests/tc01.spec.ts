import { test } from "../fixtures/fixture.ts";
import { Menu } from "../type/menu.type.ts";

test.describe("Register case", () => {
    test(
        "TC01: Verify Successful User Registration",
        {
            tag: ["@smoke", "@regression"],
        },
        async ({ homePage, registerPage, accountPage }) => {
            const username = `testuser_${Date.now()}`;
            const email = `${username}@example.com`;

            await homePage.goTo(Menu.MY_ACCOUNT);
            await registerPage.register(email, "Playwright@123456");

            await accountPage.shouldMyAccountPageDisplay(username);
        }
    );
});