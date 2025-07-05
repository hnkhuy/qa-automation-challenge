import { test, expect } from '@playwright/test';

test('Verify login with valid credentials', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
  await page.getByPlaceholder('Username').fill('admin')
  await page.getByPlaceholder('Password').fill('admin123')
  await page.locator(".orangehrm-login-button").click()

  await expect(page).toHaveURL("https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index")
  await expect(page).toHaveTitle(/OrangeHRM/);
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
}


)