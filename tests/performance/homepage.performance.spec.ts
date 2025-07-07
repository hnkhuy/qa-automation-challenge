import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
import 'dotenv/config';

test('Verify that the Homepage loads quickly', async ({ page }) => {
  const start = Date.now();
  await page.goto(process.env.BASE_URL!);
  const duration = Date.now() - start;
  expect(duration).toBeLessThan(2000); // 2 seconds
}); 