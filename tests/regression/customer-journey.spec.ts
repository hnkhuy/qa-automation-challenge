import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import * as dotenv from 'dotenv';
import 'dotenv/config';

test('Critical Customer Journey: User can login', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'tag', description: 'regression' });
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login(process.env.ADMIN_USER!, process.env.ADMIN_PASS!);
  await expect(page).toHaveURL(/dashboard/);
}); 