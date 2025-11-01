import { expect, type Locator, type Page } from "@playwright/test";
import { Order } from "../models/order.ts";

export class OrderHistoryTable {
  readonly page: Page;
  readonly table: Locator;
  readonly tableHeader: Locator;
  readonly tableBody: Locator;

  constructor(page: Page) {
    this.page = page;
    this.table = page.getByRole("table");
    this.tableHeader = this.table.getByRole("rowgroup").first();
    this.tableBody = this.table.getByRole("rowgroup").last();
  }

  async shouldBeVisible() {
    await expect(this.table).toBeVisible();
  }

  async shouldContainOrderWithDetails(order: Order) {
    const orderRow = this.tableBody.getByRole("row").filter({
      hasText: `#${order.orderNumber}`,
    });
    await expect(orderRow).toBeVisible();
    await expect(orderRow).toContainText(order.date);
    await expect(orderRow).toContainText(order.total);
  }

  async shouldContainOrders(orders: Order[]) {
    for (const order of orders) {
      await this.shouldContainOrderWithDetails(order);
    }
  }
}
