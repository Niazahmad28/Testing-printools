const { expect } = require('@playwright/test');

class HomePage {
  constructor(page) {
    this.page = page;
  }

  // Generic check for logged-in state: presence of logout or profile menu
  profileMenu() {
    return this.page.locator('text=Logout, button:has-text("Logout"), a:has-text("Logout"), [aria-label="account"], [data-test="user-menu"]').first();
  }

  async assertLoggedIn() {
    await expect(this.profileMenu()).toBeVisible({ timeout: 10000 });
  }

  async takeScreenshot(name = 'home.png') {
    await this.page.screenshot({ path: `playwright-report/${name}`, fullPage: true });
  }
}

module.exports = HomePage;
