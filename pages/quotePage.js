class QuotePage {
  constructor(page) {
    this.page = page;
  }

  // Customer Selection
  selectCustomerDropdown() {
    return this.page.getByRole('button', { name: 'Select a customer...' }).first();
  }

  customerOption(name) {
    return this.page.getByRole('button', { name });
  }

  // Product Selection
  blanksButton() {
    return this.page.getByRole('button', { name: 'Blanks Select blanks from' });
  }

  productCard(text) {
    return this.page.locator('div').filter({ hasText: new RegExp(text) }).nth(1);
  }

  addProductButton() {
    return this.page.locator('.group.relative.border.border-border\\/30.rounded-lg.transition-all.duration-200.hover\\:shadow-md.cursor-pointer.hover\\:border-emerald-300.hover\\:bg-emerald-50\\/30.bg-gradient-to-r.from-green-50\\/50 > .absolute.-top-2 > .bg-emerald-500 > .lucide');
  }

  // Item Configuration
  duplicateButton(index = 0) {
    return this.page.getByRole('button', { name: 'Duplicate' }).nth(index);
  }

  quantityInput(index) {
    return this.page.getByRole('textbox', { name: '0', exact: true }).nth(index);
  }

  sizeDropdown(index) {
    return this.page.getByRole('combobox').nth(index);
  }

  sizeOption(size) {
    return this.page.getByText(size, { exact: true });
  }

  colorDropdown(index) {
    return this.page.getByRole('combobox').nth(index);
  }

  colorOption(color) {
    return this.page.getByRole('option', { name: color });
  }

  colorLabel(color) {
    return this.page.getByLabel(color).locator('div').filter({ hasText: color });
  }

  // Quote Actions
  addToQuoteButton() {
    return this.page.getByRole('button', { name: 'Add to Quote' });
  }

  saveButton() {
    return this.page.getByRole('button', { name: 'Save' }).nth(2);
  }

  toggleSwitch() {
    return this.page.getByRole('switch').first();
  }

  deliveryDaysButton(days) {
    return this.page.getByRole('button', { name: days });
  }

  sendQuoteButton() {
    return this.page.getByRole('button', { name: 'Send Quote' });
  }

  // Actions
  async selectCustomer(customerName) {
    await this.selectCustomerDropdown().click();
    await this.customerOption(customerName).click();
    await this.page.waitForTimeout(500);
  }

  async selectProductBlanks(productText) {
    await this.addProductButton().click();
    await this.blanksButton().click();
    await this.productCard(productText).click();
    await this.page.waitForTimeout(500);
  }

  async addItemWithDetails(quantity, size, color, index = 4) {
    // Fill quantity
    await this.quantityInput(index).click();
    await this.quantityInput(index).fill(quantity);

    // Select size
    await this.sizeDropdown(index).click();
    await this.sizeOption(size).click();

    // Select color using label
    await this.colorDropdown(index - 1).click();
    await this.colorLabel(color).click();
    
    await this.page.waitForTimeout(500);
  }

  async duplicateAndConfigureItem(colorName, size, colorIndex = 5) {
    await this.duplicateButton(1).click();
    await this.page.waitForTimeout(300);

    // Select color from dropdown
    await this.colorDropdown(colorIndex).click();
    await this.colorOption(colorName).click();

    // Select size
    const sizeDropdown = this.page.getByRole('combobox').filter({ hasText: 'M' }).nth(1);
    await sizeDropdown.click();
    await this.colorOption(size).click();

    await this.page.waitForTimeout(500);
  }

  async finalizeQuote(deliveryDays = '3 days') {
    await this.addToQuoteButton().click();
    await this.saveButton().click();
    await this.toggleSwitch().click();
    await this.deliveryDaysButton(deliveryDays).click();
    await this.sendQuoteButton().click();
    await this.page.waitForTimeout(1000);
  }

  async takeScreenshot(filename) {
    await this.page.screenshot({ 
      path: `playwright-report/${filename}`, 
      fullPage: true 
    });
  }
}

module.exports = QuotePage;
