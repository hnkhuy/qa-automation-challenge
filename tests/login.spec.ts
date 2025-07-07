import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test('@demo Verify login with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.login('Admin', 'admin123');

  await expect(page).toHaveURL("https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index");
  await expect(page).toHaveTitle(/OrangeHRM/);
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});

test('@demo Verify login with invalid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.login('Admin', 'wrongpass');

  await expect(page).not.toHaveURL("https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index");

  const errorMessage = await loginPage.getErrorMessage();
  expect(errorMessage).toBe('Invalid credentials');
});

test('Verify login with empty username', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.login('', 'admin123');

  await expect(page).not.toHaveURL("https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index");

  const usernameErrorMessage = await loginPage.getInputErrorMessage(0);
  expect(usernameErrorMessage).toBe('Required');
});

test('Verify login with empty password', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.login('Admin', '');

  await expect(page).not.toHaveURL("https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index");

  const passwordErrorMessage = await loginPage.getInputErrorMessage(1);
  expect(passwordErrorMessage).toBe('Required');
});

test('Verify login with both fields empty', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.login('', '');

  await expect(page).not.toHaveURL("https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index");

  const usernameErrorMessage = await loginPage.getInputErrorMessage(0);
  expect(usernameErrorMessage).toBe('Required');

  const passwordErrorMessage = await loginPage.getInputErrorMessage(1);
  expect(passwordErrorMessage).toBe('Required');
});

test('Verify username is case-sensitive', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.login('admin', 'admin123');

  await expect(page).not.toHaveURL("https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index");

  const errorMessage = await loginPage.getErrorMessage();
  expect(errorMessage).toBe('Invalid credentials');
});

test('@demo Verify password is case-sensitive', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.login('Admin', 'ADMIN123');

  await expect(page).not.toHaveURL("https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index");

  const errorMessage = await loginPage.getErrorMessage();
  expect(errorMessage).toBe('Invalid credentials');
});

test('Verify tab order in login form', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.usernameInput.focus();
  await page.keyboard.press('Tab');

  const passwordField = loginPage.passwordInput;
  await expect(passwordField).toBeFocused();

  await page.keyboard.press('Tab');

  const loginButton = loginPage.loginButton;
  await expect(loginButton).toBeFocused();
});

test('Verify field placeholder text', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();

  const usernamePlaceholder = await loginPage.usernameInput.getAttribute('placeholder');
  expect(usernamePlaceholder).toBe('Username');

  const passwordPlaceholder = await loginPage.passwordInput.getAttribute('placeholder');
  expect(passwordPlaceholder).toBe('Password');
});

test('Verify login with special characters in username', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.login('Admin!@#', 'admin123');

  await expect(page).not.toHaveURL("https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index");

  const errorMessage = await loginPage.getErrorMessage();
  expect(errorMessage).toBe('Invalid credentials');
});

test('Verify login with leading/trailing whitespace in username', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.login(' Admin ', 'admin123');

  await expect(page).toHaveURL("https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index");
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});

test('Verify login with leading/trailing whitespace in password', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.login('Admin', ' admin123 ');

  await expect(page).not.toHaveURL("https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index");

  const errorMessage = await loginPage.getErrorMessage();
  expect(errorMessage).toBe('Invalid credentials');
});

test('Verify multiple invalid login attempts', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();

  const maxAttempts = 5;
  for (let i = 0; i < maxAttempts - 1; i++) {
    await loginPage.login('Admin', 'wrongpass');
    await expect(page).not.toHaveURL("https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index");

    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBe('Invalid credentials');
  }

  const enhancedWarningMessage = await loginPage.getErrorMessage();
  expect(enhancedWarningMessage).toBe('Too many failed attempts, account is temporarily blocked');
});

test('Verify login from multiple parallel tabs', async ({ browser }) => {
  const context1 = await browser.newContext();
  const context2 = await browser.newContext();

  const page1 = await context1.newPage();
  const page2 = await context2.newPage();

  const loginPage1 = new LoginPage(page1);
  const loginPage2 = new LoginPage(page2);

  await loginPage1.navigate();
  await loginPage2.navigate();

  await loginPage1.login('Admin', 'admin123');
  await expect(page1).toHaveURL("https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index");
  await expect(page1.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  await loginPage2.login('Admin', 'admin123');
  await expect(page2).toHaveURL("https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index");
  await expect(page2.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  await context1.close();
  await context2.close();
});

test('Verify SQL Injection: \' OR \'1\'=\'1', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.login("' OR '1'='1", 'admin123');

  await expect(page).not.toHaveURL("https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index");

  const errorMessage = await loginPage.getErrorMessage();
  expect(errorMessage).toBe('Invalid credentials');
});

test('Verify SQL Injection: admin\' --', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.login("admin' --", 'admin123');

  await expect(page).not.toHaveURL("https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index");

  const errorMessage = await loginPage.getErrorMessage();
  expect(errorMessage).toBe('Invalid credentials');
});

test('Verify SQL Injection: admin\' #', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.login("admin' #", 'admin123');

  await expect(page).not.toHaveURL("https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index");

  const errorMessage = await loginPage.getErrorMessage();
  expect(errorMessage).toBe('Invalid credentials');
});

test('Verify XSS injection in input fields', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.login("<script>alert(1)</script>", 'admin123');

  page.on('dialog', dialog => {
    throw new Error('Unexpected dialog: ' + dialog.message());
  });

  await expect(page).not.toHaveURL("https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index");

  const errorMessage = await loginPage.getErrorMessage();
  expect(errorMessage).toBe('Invalid credentials');
});

test('Verify XSS injection in URL parameters', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login?username=<script>alert(1)</script>');

  page.on('dialog', dialog => {
    throw new Error('Unexpected dialog: ' + dialog.message());
  });

  const loginPage = new LoginPage(page);
  await loginPage.passwordInput.fill('admin123');
  await loginPage.loginButton.click();

  await expect(page).not.toHaveURL("https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index");

  const errorMessage = await loginPage.getErrorMessage();
  expect(errorMessage).toBe('Invalid credentials');
});

test('Verify missing CSRF token', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

  await page.route('**/auth/login', (route, request) => {
    const postData = request.postDataJSON();
    delete postData.csrf_token;
    route.continue({ postData: JSON.stringify(postData) });
  });

  const loginPage = new LoginPage(page);
  await loginPage.login('Admin', 'admin123');

  const errorMessage = await loginPage.getErrorMessage();
  expect(errorMessage).toBe('CSRF token missing or incorrect');
});

test('Verify Content-Security-Policy (CSP) Header', async ({ page }) => {
  const [response] = await Promise.all([
    page.waitForResponse(response => response.url().includes('/auth/login') && response.status() === 200),
    page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
  ]);

  const cspHeader = response.headers()['content-security-policy'];

  expect(cspHeader).toBeDefined();
  expect(cspHeader).toContain("default-src 'self'");
});


