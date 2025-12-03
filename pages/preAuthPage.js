const { expect } = require('@playwright/test');

class PreAuthPage {
  constructor(page) {
    this.page = page;
  }

  // Detect a site-wide pre-password prompt (common patterns)
  passwordInput() {
    return this.page.locator('input[type="password"]').first();
  }

  submitButton() {
    return this.page.locator('button:has-text("Enter"), button:has-text("Submit"), button:has-text("Go"), button[type="submit"]').first();
  }

  async isPresent() {
    try {
      return await this.passwordInput().count() > 0 && await this.passwordInput().isVisible();
    } catch (e) {
      return false;
    }
  }

  async enterPrePassword(pass) {
    const input = this.passwordInput();
    await expect(input).toBeVisible({ timeout: 5000 });
    await input.fill(pass);
    await Promise.all([
      this.page.waitForLoadState('networkidle').catch(() => {}),
      this.submitButton().click(),
    ]);
  }
}

module.exports = PreAuthPage;
