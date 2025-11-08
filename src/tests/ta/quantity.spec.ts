import { test } from "../../fixtures/test.context.ts";
import { Menu } from "../../type/menu.type.ts";

test.describe("Cart Quantity Management", () => {
  test(
    "TC_09: Verify users can update quantity of product in cart",
    {
      tag: ["@regression"],
    },
    async ({ accountPage, shopPage, cartPage }) => {
      // Ensure cart is empty before starting test to avoid interference
      await cartPage.goToCart();
      await cartPage.clearCart();

      // Step 3: Go to Shop page
      await accountPage.navigateTo(Menu.SHOP);

      // Step 4: Add a product
      const selectedProduct = await shopPage.addRandomItemToCart();

      // Step 5: Go to the cart
      await shopPage.goToCart();
      await cartPage.shouldCartPageDisplay();

      // Step 6: Verify initial quantity and subtotal
      await cartPage.shouldHaveProductWithQuantity(selectedProduct, 1);

      // Step 7-8: Increase quantity and verify
      await cartPage.increaseProductQuantity(selectedProduct.name);
      await cartPage.updateCart();
      await cartPage.shouldHaveProductWithQuantity(selectedProduct, 2);

      // Step 9-10: Set quantity to 4 and verify
      await cartPage.setProductQuantity(selectedProduct.name, 4);
      await cartPage.updateCart();
      await cartPage.shouldHaveProductWithQuantity(selectedProduct, 4);

      // Step 11-12: Decrease quantity and verify
      await cartPage.decreaseProductQuantity(selectedProduct.name);
      await cartPage.updateCart();
      await cartPage.shouldHaveProductWithQuantity(selectedProduct, 3);
    },
  );
});
