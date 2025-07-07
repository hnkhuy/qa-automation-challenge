import { Page, Locator } from '@playwright/test';

export class DashboardPage {
    readonly page: Page;
    readonly heading: Locator;

    constructor(page: Page) {
        this.page = page;
        this.heading = page.getByRole('heading', { name: 'Dashboard' });
    }

    async isVisible() {
        return await this.heading.isVisible();
    }
} 