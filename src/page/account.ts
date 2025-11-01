import type { Locator, Page } from "@playwright/test";
import { HomePage } from "./home.ts";
import { Order } from "../models/order.ts";
import { OrderHistoryTable } from "../table/order.history.table.ts";

export class AccountPage extends HomePage {
  readonly ordersLink: Locator;
  readonly orderHistoryTable: OrderHistoryTable;

  constructor(page: Page) {
    super(page);
    this.ordersLink = this.page
      .getByRole("navigation")
      .getByRole("link", { name: "Orders" });
    this.orderHistoryTable = new OrderHistoryTable(page);
  }

  async navigateToOrders() {
    await this.ordersLink.click();
  }

  async shouldHaveSpecificOrdersInHistory(expectedOrders: Order[]) {
    await this.orderHistoryTable.shouldContainOrders(expectedOrders);
  }
}
