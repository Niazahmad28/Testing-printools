const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;
  }

  // Find the best matching email/username input
  emailInput() {
    return this.page.locator('input[name="email"], input#email, input[type="email"], input[name="username"], input#username, input[type="text"]').first();
  }

  passwordInput() {
    return this.page.locator('input[name="password"], input[type="password"]').first();
  }

  submitButton() {
    return this.page.locator('button[type="submit"], button:has-text("Log in"), button:has-text("Sign in"), button:has-text("Login")').first();
  }

  async gotoLogin() {
    // try common login link text
    const loginLink = this.page.locator('a:has-text("Log in"), a:has-text("Sign in"), a:has-text("Login"), a[href*="login"], a[href*="signin"]').first();
    if (await loginLink.count()) {
      await loginLink.click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  async login(username, password) {
    const email = this.emailInput();
    const pass = this.passwordInput();
    await expect(email).toBeVisible({ timeout: 5000 });
    await email.fill(username);
    await pass.fill(password);
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => {}),
      this.submitButton().click(),
    ]);
  }
}

module.exports = LoginPage;
