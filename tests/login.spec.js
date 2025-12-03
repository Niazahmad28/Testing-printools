const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/loginPage');
const PreAuthPage = require('../pages/preAuthPage');
const HomePage = require('../pages/homePage');

test.describe('Printools Login Tests (POM)', () => {
  const baseUrl = process.env.BASE_URL || 'https://printools.io/';
  const prePass = process.env.PRE_PASS || 'angel123';
  const email = process.env.TEST_USER || 'testing23@mailinator.com';
  const password = process.env.TEST_PASS || 'Test@1234';

  test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl);
    
    // Handle pre-auth password
    const preAuth = new PreAuthPage(page);
    await preAuth.enterPassword(prePass);
    
    // Navigate to dashboard/login page
    const login = new LoginPage(page);
    await login.goToDashboard();
  });

  test('Valid login and logout', async ({ page }) => {
    const login = new LoginPage(page);
    const home = new HomePage(page);

    // Perform login
    await login.login(email, password);

    // Verify logged in
    await home.assertLoggedIn();
    await home.takeScreenshot('login-success.png');

    // Logout
    await home.logout();

    // Verify logged out - back to login form
    await expect(login.emailInput()).toBeVisible({ timeout: 5000 });
  });

  test('Invalid password should fail', async ({ page }) => {
    const login = new LoginPage(page);

    // Attempt login with wrong password
    await login.login(email, 'WrongPassword123');

    // Should remain on login page
    await expect(login.emailInput()).toBeVisible({ timeout: 5000 });
    await page.screenshot({ path: 'playwright-report/login-invalid.png', fullPage: true });
  });

  test('Empty email validation', async ({ page }) => {
    const login = new LoginPage(page);

    // Fill only password, leave email empty
    await login.passwordInput().fill(password);
    await login.submitButton().click();

    // Should stay on login form
    await expect(login.emailInput()).toBeVisible({ timeout: 5000 });
  });

  test('Empty password validation', async ({ page }) => {
    const login = new LoginPage(page);

    // Fill only email, leave password empty
    await login.emailInput().fill(email);
    await login.submitButton().click();

    // Should stay on login form
    await expect(login.emailInput()).toBeVisible({ timeout: 5000 });
  });

  test('Both fields empty validation', async ({ page }) => {
    const login = new LoginPage(page);

    // Click submit without filling anything
    await login.submitButton().click();

    // Should stay on login form
    await expect(login.emailInput()).toBeVisible({ timeout: 5000 });
  });
});

