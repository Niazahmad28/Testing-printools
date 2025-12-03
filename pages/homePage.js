const { expect } = require('@playwright/test');

class HomePage {
  constructor(page) {
    this.page = page;
  }

  profileButton() {
    return this.page.getByRole('button', { name: 'UN Printing 1 UN Printing 1' });
  }

  signOutButton() {
    return this.page.getByRole('button', { name: 'Sign Out' });
  }

  async assertLoggedIn() {
    await expect(this.profileButton()).toBeVisible({ timeout: 10000 });
  }

  async logout() {
    if (await this.profileButton().isVisible()) {
      await this.profileButton().click();
    }
    await this.signOutButton().click();
  }

  async takeScreenshot(name = 'home.png') {
    await this.page.screenshot({ path: `playwright-report/${name}`, fullPage: true });
  }
}

module.exports = HomePage;
