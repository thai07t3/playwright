import type { Page } from "@playwright/test";
import { HomePage } from "./home.ts";

export class Account extends HomePage {

    constructor(page: Page) {
        super(page);
    }
}