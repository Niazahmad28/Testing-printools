const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/loginPage');
const HomePage = require('../pages/homePage');

test.describe('Printools basic flow', () => {
  test('Login and verify dashboard (POM)', async ({ page }) => {
    const base = process.env.BASE_URL || 'https://printools.io/';
    const user = process.env.TEST_USER || 'testing23@mailinator.com';
    const pass = process.env.TEST_PASS || 'Test@1234';

    const login = new LoginPage(page);
    const home = new HomePage(page);

    await page.goto(base);

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
