import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { SearchPage } from '../pages/search.page';
import * as dotenv from 'dotenv';
import 'dotenv/config';

const BASE_URL = process.env.BASE_URL!;
const ADMIN_USER = process.env.ADMIN_USER!;
const ADMIN_PASS = process.env.ADMIN_PASS!;

test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(ADMIN_USER, ADMIN_PASS);
    await expect(page).toHaveURL(`${BASE_URL}/dashboard/index`);
});

test('@demo Verify search with valid menu keyword', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.search('Directory');
    await expect(searchPage.searchResults).toBeVisible();
    await expect(searchPage.searchResults).toHaveText('Directory');
});

test('Verify search with partial match', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.search('rec');
    await expect(searchPage.searchResults.first()).toBeVisible();
    await expect(searchPage.searchResults.first()).toContainText('Recruitment');
});

test('Verify search with lowercase input', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.search('directory');
    await expect(searchPage.searchResults).toBeVisible();
    await expect(searchPage.searchResults).toHaveText('Directory');
});

test('@demo Verify search with uppercase input', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.search('DIRECTORY');
    await expect(searchPage.searchResults).toBeVisible();
    await expect(searchPage.searchResults).toHaveText('Directory');
});

test('Verify search with invalid input', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.search('InvalidKeyword');
    await expect(searchPage.searchResults).not.toBeVisible();
});

test('Verify search with empty input', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.search('');
    const resultsCount = await searchPage.getResultsCount();
    expect(resultsCount).toEqual(12);
});

test('Verify result selection navigates correctly', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.search('Directory');
    await searchPage.clickResultByText('Directory');
    await expect(page).toHaveURL(/.*\/directory/);
    await expect(page.getByRole('heading', { name: 'Directory' }).first()).toBeVisible();
});

test('Verify search resets after navigation', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.search('Directory');
    await searchPage.clickResultByText('Directory');
    await page.goBack();
    expect(await searchPage.isSearchBarEmpty()).toBeTruthy();
});

test('Verify search works for multi-word input', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.search('My Info');
    await expect(await searchPage.isResultVisible('My Info')).toBeTruthy();
});

test('Verify search hides after result click', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.search('Directory');
    await searchPage.clickResultByText('Directory');
    await expect(await searchPage.isSearchBarVisible()).toBeFalsy();
    await expect(page).toHaveURL(/.*\/directory/);
});

test(`Verify SQL Injection: ' OR '1'='1 in search input`, async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.search("' OR '1'='1");
    await expect(searchPage.searchResults).not.toBeVisible();
});

test(`Verify SQL Injection: admin' -- in search input`, async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.search("admin' --");
    await expect(searchPage.searchResults).not.toBeVisible();
});

test(`Verify SQL Injection: admin' # in search input`, async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.search("admin' #");
    await expect(searchPage.searchResults).not.toBeVisible();
});

test('Verify XSS injection in search input', async ({ page }) => {
    const searchPage = new SearchPage(page);
    page.on('dialog', dialog => {
        throw new Error('Unexpected dialog: ' + dialog.message());
    });
    await searchPage.search('<script>alert(1)</script>');
    await expect(searchPage.searchResults).not.toBeVisible();
});

test('Verify Content-Security-Policy (CSP) Header on search', async ({ page }) => {
    const [response] = await Promise.all([
        page.waitForResponse(response => response.url().includes('/dashboard') && response.status() === 200),
        page.goto(`${BASE_URL}/dashboard/index`)
    ]);
    const cspHeader = response.headers()['content-security-policy'];
    expect(cspHeader).toBeDefined();
    expect(cspHeader).toContain("default-src 'self'");
});


