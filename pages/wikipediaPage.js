const { expect } = require('@playwright/test');

class WikipediaPage {
  constructor(page) {
    this.page = page;
    this.searchInput = page.locator('input#searchInput');
    this.heading = page.locator('h1');
  }

  async goto() {
    await this.page.goto('https://www.wikipedia.org/');
  }

  async search(query) {
    await this.searchInput.fill(query);
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'networkidle' }),
      this.searchInput.press('Enter'),
    ]);
  }

  async assertHeadingContains(text) {
    await expect(this.heading).toContainText(text);
  }

  async screenshot(path) {
    await this.page.screenshot({ path, fullPage: true });
  }
}

module.exports = WikipediaPage;
