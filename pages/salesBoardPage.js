class SalesBoardPage {
  constructor(page) {
    this.page = page;
  }

  // Locators
  salesBoardLink() {
    return this.page.getByRole('link', { name: 'Sales Board' });
  }

  addNewQuoteButton() {
    return this.page.getByRole('button', { name: 'Add New Quote' });
  }

  actionsButton() {
    return this.page.getByRole('button', { name: 'Actions' }).first();
  }

  approveButton() {
    return this.page.getByRole('button', { name: 'Approve', exact: true });
  }

  addToJobButton() {
    return this.page.getByRole('button', { name: 'Add to Job' });
  }

  // Actions
  async navigateToSalesBoard() {
    await this.salesBoardLink().click();
    await this.page.waitForTimeout(1000); // Wait for page load
  }

  async clickAddNewQuote() {
    await this.addNewQuoteButton().click();
    await this.page.waitForTimeout(500);
  }

  async approveQuote() {
    await this.actionsButton().click();
    await this.approveButton().click();
    await this.page.waitForTimeout(500);
  }

  async addQuoteToJob() {
    await this.actionsButton().click();
    await this.addToJobButton().click();
    await this.page.waitForTimeout(500);
  }

  async takeScreenshot(filename) {
    await this.page.screenshot({ 
      path: `playwright-report/${filename}`, 
      fullPage: true 
    });
  }
}

module.exports = SalesBoardPage;
