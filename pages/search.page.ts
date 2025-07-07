import { Page, Locator } from '@playwright/test';

export class SearchPage {
    readonly page: Page;
    readonly searchBar: Locator;
    readonly searchResults: Locator;

    constructor(page: Page) {
        this.page = page;
        this.searchBar = page.getByPlaceholder('Search');
        this.searchResults = page.locator('.oxd-main-menu-item--name');
    }

    async search(keyword: string) {
        await this.searchBar.fill(keyword);
        await this.searchBar.press('Enter');
    }

    async getResultsCount() {
        return await this.searchResults.count();
    }

    async getResultByText(text: string) {
        return this.page.locator('.oxd-main-menu-item--name', { hasText: text });
    }

    async isResultVisible(text: string) {
        const result = await this.getResultByText(text);
        return await result.isVisible();
    }

    async clickResultByText(text: string) {
        const result = await this.getResultByText(text);
        await result.click();
    }

    async isSearchBarVisible() {
        return await this.searchBar.isVisible();
    }

    async isSearchBarEmpty() {
        return await this.searchBar.inputValue() === '';
    }
} 