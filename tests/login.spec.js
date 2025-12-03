const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/loginPage');
const PreAuthPage = require('../pages/preAuthPage');
const HomePage = require('../pages/homePage');

test.describe('Login test cases (Printools)', () => {
  const base = process.env.BASE_URL || 'https://printools.io';
  const user = process.env.TEST_USER || 'testing23@mailinator.com';
  const pass = process.env.TEST_PASS || 'Test@1234';
  const prePass = process.env.PRE_PASS || 'angel123';

  test.beforeEach(async ({ page }) => {
    await page.goto(base);
    const preAuth = new PreAuthPage(page);
    if (await preAuth.isPresent()) {
      await preAuth.enterPrePassword(prePass);
    }
  });

  test('Valid login should reach dashboard', async ({ page }) => {
    const login = new LoginPage(page);
    const home = new HomePage(page);

    await login.gotoLogin();

    // Some pages show role buttons before the form
    const customerBtn = page.locator('button:has-text("Customer Login")').first();
    const adminBtn = page.locator('button:has-text("Admin Login")').first();
    if (await customerBtn.count()) {
      await customerBtn.click();
      await page.waitForTimeout(500);
    } else if (await adminBtn.count()) {
      await adminBtn.click();
      await page.waitForTimeout(500);
    }

    await login.login(user, pass);

    // Assert logged in (profile/logout visible)
    await home.assertLoggedIn();
    await home.takeScreenshot('login-valid.png');

    // Optional: try logout and verify login form returns
    const logout = page.locator('a:has-text("Logout"), button:has-text("Logout")').first();
    if (await logout.count()) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => {}),
        logout.click(),
      ]);
      await expect(login.emailInput()).toBeVisible({ timeout: 5000 });
    }
  });

  test('Invalid password should not login', async ({ page }) => {
    const login = new LoginPage(page);
    const home = new HomePage(page);

    await login.gotoLogin();
    // attempt login with wrong password
    await login.login(user, 'wrong-password');

    // Expect not logged in: profile menu should NOT be visible
    // We assert that login input is still visible (login failed)
    await expect(login.emailInput()).toBeVisible({ timeout: 5000 });
    await page.screenshot({ path: 'playwright-report/login-invalid.png', fullPage: true });
  });

  test('Empty fields validation (submit without data)', async ({ page }) => {
    const login = new LoginPage(page);

    await login.gotoLogin();

    // Click submit directly without filling
    const submit = login.submitButton();
    if (await submit.count()) {
      await submit.click();
      // Expect the email input to remain visible (validation)
      await expect(login.emailInput()).toBeVisible({ timeout: 5000 });
    }
  });
});
