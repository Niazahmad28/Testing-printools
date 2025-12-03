const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/loginPage');
const HomePage = require('../pages/homePage');
const PreAuthPage = require('../pages/preAuthPage');

test.describe('Printools basic flow', () => {
  test('Login and verify dashboard (POM)', async ({ page }) => {
    const base = process.env.BASE_URL || 'https://printools.io/';
    const user = process.env.TEST_USER || 'testing23@mailinator.com';
    const pass = process.env.TEST_PASS || 'Test@1234';

    const login = new LoginPage(page);
    const home = new HomePage(page);
    const preAuth = new PreAuthPage(page);

    await page.goto(base);

    // Handle possible pre-auth password prompt (site-level)
    const prePass = process.env.PRE_PASS || 'angel123';
    if (await preAuth.isPresent()) {
      await preAuth.enterPrePassword(prePass);
    }

    // Try to open login if site shows a link
    await login.gotoLogin();

    // Perform login
    await login.login(user, pass);

    // Assert logged in
    await home.assertLoggedIn();

    // Take screenshot for report
    await home.takeScreenshot('printools-login.png');
  });
});
