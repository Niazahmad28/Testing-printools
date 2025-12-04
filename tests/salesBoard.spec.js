const { test, expect } = require('@playwright/test');
const PreAuthPage = require('../pages/preAuthPage');
const LoginPage = require('../pages/loginPage');
const HomePage = require('../pages/homePage');
const SalesBoardPage = require('../pages/salesBoardPage');
const QuotePage = require('../pages/quotePage');

test.describe('Sales Board - Add New Quote Tests', () => {
  const baseUrl = process.env.BASE_URL || 'https://printools.io/';
  const prePass = process.env.PRE_PASS || 'angel123';
  const email = process.env.TEST_USER || 'testing23@mailinator.com';
  const password = process.env.TEST_PASS || 'Test@1234';

  test.beforeEach(async ({ page }) => {
    // Pre-auth and login
    await page.goto(baseUrl);
    
    const preAuth = new PreAuthPage(page);
    await preAuth.enterPassword(prePass);
    
    const login = new LoginPage(page);
    await login.goToDashboard();
    await login.login(email, password);
    
    // Verify logged in
    const home = new HomePage(page);
    await home.assertLoggedIn();
  });

  test('Complete Quote Creation - Kids Shirts with Multiple Variants', async ({ page }) => {
    // Direct codegen flow
    await page.getByRole('link', { name: 'Sales Board' }).click();
    await page.getByRole('button', { name: 'Add New Quote' }).click();
    await page.getByRole('button', { name: 'Select a customer...' }).first().click();
    await page.getByRole('button', { name: 'Customer Testing' }).click();
    await page.locator('.group.relative.border.border-border\\/30.rounded-lg.transition-all.duration-200.hover\\:shadow-md.cursor-pointer.hover\\:border-emerald-300.hover\\:bg-emerald-50\\/30.bg-gradient-to-r.from-green-50\\/50 > .absolute.-top-2 > .bg-emerald-500 > .lucide').click();
    await page.getByRole('button', { name: 'Blanks Select blanks from' }).click();
    await page.locator('div').filter({ hasText: /^Kids ShirtsCode: S9018Partner: ARTS SPOT\$9\.99$/ }).nth(1).click();
    await page.getByRole('button', { name: 'Duplicate' }).click();
    await page.getByRole('textbox', { name: '0', exact: true }).nth(4).click();
    await page.getByRole('textbox', { name: '0', exact: true }).nth(4).fill('5');
    await page.getByRole('combobox').nth(4).click();
    await page.getByText('M', { exact: true }).click();
    await page.getByRole('combobox').nth(3).click();
    await page.getByLabel('GRAY').locator('div').filter({ hasText: 'GRAY' }).click();
    await page.getByRole('button', { name: 'Duplicate' }).nth(1).click();
    await page.getByRole('combobox').nth(5).click();
    await page.getByRole('option', { name: 'PMS 162C PINK' }).click();
    await page.getByRole('combobox').filter({ hasText: 'M' }).nth(1).click();
    await page.getByRole('option', { name: 'L', exact: true }).click();
    await page.getByRole('button', { name: 'Add to Quote' }).click();
    await page.getByRole('button', { name: 'Save' }).nth(2).click();
    await page.getByRole('switch').first().click();
    await page.getByRole('button', { name: '3 days' }).click();
    await page.getByRole('button', { name: 'Send Quote' }).click();
    await page.getByRole('button', { name: 'Actions' }).first().click();
    await page.getByRole('button', { name: 'Approve', exact: true }).click();
    await page.getByRole('button', { name: 'Actions' }).first().click();
    await page.getByRole('button', { name: 'Add to Job' }).click();
    
    await page.screenshot({ path: 'playwright-report/quote-complete.png', fullPage: true });
  });

  test('Add Quote - Customer Selection Validation', async ({ page }) => {
    const salesBoard = new SalesBoardPage(page);
    const quote = new QuotePage(page);

    await salesBoard.navigateToSalesBoard();
    await salesBoard.clickAddNewQuote();

    // Verify customer dropdown is visible
    await expect(quote.selectCustomerDropdown()).toBeVisible({ timeout: 5000 });
    
    await quote.selectCustomer('Customer Testing');
    
    // Verify customer selected (dropdown should be clickable again if needed)
    await expect(quote.blanksButton()).toBeVisible({ timeout: 5000 });
  });

  test('Add Quote - Product Selection Flow', async ({ page }) => {
    const salesBoard = new SalesBoardPage(page);
    const quote = new QuotePage(page);

    await salesBoard.navigateToSalesBoard();
    await salesBoard.clickAddNewQuote();
    await quote.selectCustomer('Customer Testing');

    // Click add product button
    await quote.addProductButton().click();
    
    // Verify blanks button appears
    await expect(quote.blanksButton()).toBeVisible({ timeout: 5000 });
    
    await quote.blanksButton().click();

    // Verify product selection interface loaded
    await page.waitForTimeout(1000);
    await quote.takeScreenshot('product-selection.png');
  });

  test('Add Quote - Item Configuration with Quantity and Size', async ({ page }) => {
    const salesBoard = new SalesBoardPage(page);
    const quote = new QuotePage(page);

    await salesBoard.navigateToSalesBoard();
    await salesBoard.clickAddNewQuote();
    await quote.selectCustomer('Customer Testing');
    await quote.selectProductBlanks('Kids ShirtsCode: S9018Partner: ARTS SPOT\\$9\\.99');
    
    await quote.duplicateButton(0).click();
    await page.waitForTimeout(300);

    // Fill quantity
    const qtyInput = quote.quantityInput(4);
    await qtyInput.click();
    await qtyInput.fill('10');

    // Verify quantity entered
    await expect(qtyInput).toHaveValue('10');

    // Select size
    await quote.sizeDropdown(4).click();
    await quote.sizeOption('L').click();

    await quote.takeScreenshot('item-configured.png');
  });

  test('Add Quote - Send Quote without Approval', async ({ page }) => {
    const salesBoard = new SalesBoardPage(page);
    const quote = new QuotePage(page);

    await salesBoard.navigateToSalesBoard();
    await salesBoard.clickAddNewQuote();
    await quote.selectCustomer('Customer Testing');
    await quote.selectProductBlanks('Kids ShirtsCode: S9018Partner: ARTS SPOT\\$9\\.99');
    
    await quote.duplicateButton(0).click();
    await quote.addItemWithDetails('3', 'S', 'GRAY', 4);

    // Send quote without final approval
    await quote.addToQuoteButton().click();
    await quote.saveButton().click();
    await quote.toggleSwitch().click();
    await quote.deliveryDaysButton('3 days').click();
    await quote.sendQuoteButton().click();

    await page.waitForTimeout(1000);
    await quote.takeScreenshot('quote-sent-no-approval.png');

    // Verify quote appears in list (Actions button should be visible)
    await expect(salesBoard.actionsButton()).toBeVisible({ timeout: 5000 });
  });
});
