import { test, expect } from '@playwright/test';
import { loginViaApi } from '../../utils/api-helpers';
import * as dotenv from 'dotenv';
import 'dotenv/config';

test('Veriify that the API login returns token', async () => {
  const data = await loginViaApi(process.env.BASE_URL!, process.env.ADMIN_USER!, process.env.ADMIN_PASS!);
  expect(data.token).toBeDefined();
}); 