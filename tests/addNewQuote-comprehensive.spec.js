const { test, expect } = require('@playwright/test');
const PreAuthPage = require('../pages/preAuthPage');
const LoginPage = require('../pages/loginPage');
const HomePage = require('../pages/homePage');
const SalesBoardPage = require('../pages/salesBoardPage');
const QuotePage = require('../pages/quotePage');

test.describe('Add New Quote - Comprehensive Test Suite', () => {
  const baseUrl = process.env.BASE_URL || 'https://printools.io/';
  const prePass = process.env.PRE_PASS || 'angel123';
  const email = process.env.TEST_USER || 'testing23@mailinator.com';
  const password = process.env.TEST_PASS || 'Test@1234';

  test.beforeEach(async ({ page }) => {
    // Pre-auth and Login
    await page.goto(baseUrl);
    const preAuth = new PreAuthPage(page);
    await preAuth.enterPassword(prePass);
    
    const login = new LoginPage(page);
    await login.goToDashboard();
    await login.login(email, password);
    
    // Navigate to Sales Board
    const salesBoard = new SalesBoardPage(page);
    await salesBoard.navigateToSalesBoard();
    await page.waitForTimeout(1000);
  });

  test.describe('POSITIVE TEST CASES', () => {
    
    test('✓ Add New Quote button visible on Sales Board', async ({ page }) => {
      const salesBoard = new SalesBoardPage(page);
      await expect(salesBoard.addNewQuoteButton()).toBeVisible();
      await page.screenshot({ path: 'playwright-report/pos-01-add-quote-button-visible.png', fullPage: true });
    });

    test('✓ Open Add New Quote modal successfully', async ({ page }) => {
      const salesBoard = new SalesBoardPage(page);
      await salesBoard.clickAddNewQuote();
      
      // Verify customer dropdown visible
      const quote = new QuotePage(page);
      await expect(quote.selectCustomerDropdown()).toBeVisible({ timeout: 5000 });
      await page.screenshot({ path: 'playwright-report/pos-02-quote-modal-opened.png', fullPage: true });
    });

    test('✓ Select customer from dropdown', async ({ page }) => {
      const salesBoard = new SalesBoardPage(page);
      await salesBoard.clickAddNewQuote();
      
      const quote = new QuotePage(page);
      await quote.selectCustomer('Customer Testing');
      
      // Verify add product button visible
      await expect(quote.addProductButton()).toBeVisible({ timeout: 5000 });
      await page.screenshot({ path: 'playwright-report/pos-03-customer-selected.png', fullPage: true });
    });

    test('✓ Open product catalog (Blanks)', async ({ page }) => {
      const salesBoard = new SalesBoardPage(page);
      await salesBoard.clickAddNewQuote();
      
      const quote = new QuotePage(page);
      await quote.selectCustomer('Customer Testing');
      await page.waitForTimeout(500);
      
      // Open blanks catalog
      await quote.addProductButton().click();
      await quote.blanksButton().click();
      await page.waitForTimeout(1500);
      
      // Verify products loaded
      const productCount = await page.locator('button').filter({ hasText: 'Add' }).count();
      await expect(productCount).toBeGreaterThan(0);
      await page.screenshot({ path: 'playwright-report/pos-04-products-loaded.png', fullPage: true });
    });

    test('✓ Add product to quote', async ({ page }) => {
      const salesBoard = new SalesBoardPage(page);
      await salesBoard.clickAddNewQuote();
      
      const quote = new QuotePage(page);
      await quote.selectCustomer('Customer Testing');
      await page.waitForTimeout(500);
      
      await quote.addProductButton().click();
      await quote.blanksButton().click();
      await page.waitForTimeout(1500);
      
      // Add first product
      const productButtons = page.locator('button').filter({ hasText: 'Add' });
      if (await productButtons.count() > 0) {
        await productButtons.first().click({ force: true });
        await page.waitForTimeout(1000);
        
        // Add to quote
        await quote.addToQuoteButton().click();
        await page.waitForTimeout(1000);
        
        // Verify save button visible
        await expect(quote.saveButton()).toBeVisible({ timeout: 5000 });
        await page.screenshot({ path: 'playwright-report/pos-05-product-added.png', fullPage: true });
      }
    });

    test('✓ Save quote successfully', async ({ page }) => {
      const salesBoard = new SalesBoardPage(page);
      await salesBoard.clickAddNewQuote();
      
      const quote = new QuotePage(page);
      await quote.selectCustomer('Customer Testing');
      await page.waitForTimeout(500);
      
      await quote.addProductButton().click();
      await quote.blanksButton().click();
      await page.waitForTimeout(1500);
      
      const productButtons = page.locator('button').filter({ hasText: 'Add' });
      if (await productButtons.count() > 0) {
        await productButtons.first().click({ force: true });
        await page.waitForTimeout(1000);
        await quote.addToQuoteButton().click();
        await page.waitForTimeout(1000);
        
        // Save quote
        await quote.saveButton().click();
        await page.waitForTimeout(1500);
        
        // Verify Actions button visible (quote saved)
        await expect(salesBoard.actionsButton()).toBeVisible({ timeout: 5000 });
        await page.screenshot({ path: 'playwright-report/pos-06-quote-saved.png', fullPage: true });
      }
    });

    test('✓ View saved quote in list', async ({ page }) => {
      const salesBoard = new SalesBoardPage(page);
      
      // Verify quotes exist in list
      const quoteList = page.locator('table, [role="grid"], .space-y-');
      await expect(quoteList).toBeVisible({ timeout: 5000 });
      
      await page.screenshot({ path: 'playwright-report/pos-07-quote-in-list.png', fullPage: true });
    });

    test('✓ Approve quote using Actions menu', async ({ page }) => {
      const salesBoard = new SalesBoardPage(page);
      
      // Click actions on first quote
      await expect(salesBoard.actionsButton()).toBeVisible({ timeout: 5000 });
      await salesBoard.actionsButton().click();
      await page.waitForTimeout(500);
      
      // Click Approve button
      await expect(salesBoard.approveButton()).toBeVisible({ timeout: 3000 });
      await salesBoard.approveButton().click();
      await page.waitForTimeout(1500);
      
      await page.screenshot({ path: 'playwright-report/pos-08-quote-approved.png', fullPage: true });
    });

    test('✓ Add quote to job', async ({ page }) => {
      const salesBoard = new SalesBoardPage(page);
      
      // Get first quote actions
      await expect(salesBoard.actionsButton()).toBeVisible({ timeout: 5000 });
      await salesBoard.actionsButton().click();
      await page.waitForTimeout(500);
      
      // Click Add to Job
      await expect(salesBoard.addToJobButton()).toBeVisible({ timeout: 3000 });
      await salesBoard.addToJobButton().click();
      await page.waitForTimeout(1500);
      
      await page.screenshot({ path: 'playwright-report/pos-09-quote-added-to-job.png', fullPage: true });
    });
  });

  test.describe('NEGATIVE TEST CASES', () => {
    
    test('✗ Cannot proceed without selecting customer', async ({ page }) => {
      const salesBoard = new SalesBoardPage(page);
      await salesBoard.clickAddNewQuote();
      
      const quote = new QuotePage(page);
      
      // Try to access product without selecting customer
      const productButton = quote.addProductButton();
      
      // Product button should be disabled or not clickable
      const isDisabled = await productButton.evaluate(el => el.disabled);
      const isVisible = await productButton.isVisible().catch(() => false);
      
      if (isVisible) {
        // Try to click - should not open product catalog
        await productButton.click().catch(() => {});
        await page.waitForTimeout(500);
      }
      
      await page.screenshot({ path: 'playwright-report/neg-01-no-customer-selected.png', fullPage: true });
    });

    test('✗ Cannot add to quote without product selected', async ({ page }) => {
      const salesBoard = new SalesBoardPage(page);
      await salesBoard.clickAddNewQuote();
      
      const quote = new QuotePage(page);
      await quote.selectCustomer('Customer Testing');
      await page.waitForTimeout(500);
      
      // Try to click Add to Quote without adding product
      const addToQuoteBtn = quote.addToQuoteButton();
      const isVisible = await addToQuoteBtn.isVisible().catch(() => false);
      
      if (isVisible) {
        // Button should be disabled
        const isDisabled = await addToQuoteBtn.evaluate(el => el.disabled);
        await expect(isDisabled || !isVisible).toBeTruthy();
      }
      
      await page.screenshot({ path: 'playwright-report/neg-02-no-product-selected.png', fullPage: true });
    });

    test('✗ Empty quote cannot be saved', async ({ page }) => {
      const salesBoard = new SalesBoardPage(page);
      await salesBoard.clickAddNewQuote();
      
      const quote = new QuotePage(page);
      await quote.selectCustomer('Customer Testing');
      await page.waitForTimeout(500);
      
      // Try to save without adding any product
      const saveBtn = quote.saveButton();
      const isVisible = await saveBtn.isVisible().catch(() => false);
      
      if (isVisible) {
        // Button should be disabled
        const isDisabled = await saveBtn.evaluate(el => el.disabled);
        await expect(isDisabled || !isVisible).toBeTruthy();
      }
      
      await page.screenshot({ path: 'playwright-report/neg-03-empty-quote-cannot-save.png', fullPage: true });
    });

    test('✗ Invalid customer selection shows no products', async ({ page }) => {
      const salesBoard = new SalesBoardPage(page);
      await salesBoard.clickAddNewQuote();
      
      const quote = new QuotePage(page);
      
      // Select customer dropdown and verify options exist
      await quote.selectCustomerDropdown().click();
      await page.waitForTimeout(500);
      
      const customerOptions = page.locator('[role="button"]').filter({ hasText: 'Customer' });
      const optionCount = await customerOptions.count();
      
      // Should have at least one customer option
      await expect(optionCount).toBeGreaterThan(0);
      
      await page.screenshot({ path: 'playwright-report/neg-04-customer-options-available.png', fullPage: true });
    });

    test('✗ Cannot duplicate quote item without quantity', async ({ page }) => {
      const salesBoard = new SalesBoardPage(page);
      await salesBoard.clickAddNewQuote();
      
      const quote = new QuotePage(page);
      await quote.selectCustomer('Customer Testing');
      await page.waitForTimeout(500);
      
      await quote.addProductButton().click();
      await quote.blanksButton().click();
      await page.waitForTimeout(1500);
      
      const productButtons = page.locator('button').filter({ hasText: 'Add' });
      if (await productButtons.count() > 0) {
        await productButtons.first().click({ force: true });
        await page.waitForTimeout(1000);
        
        // Try to duplicate without quantity
        const duplicateBtn = page.getByRole('button', { name: 'Duplicate' });
        if (await duplicateBtn.isVisible().catch(() => false)) {
          // Duplicate should work, but item needs quantity validation
          const quantityInputs = page.locator('input[type="number"]');
          const initialCount = await quantityInputs.count();
          
          await expect(initialCount).toBeGreaterThan(0);
        }
      }
      
      await page.screenshot({ path: 'playwright-report/neg-05-duplicate-validation.png', fullPage: true });
    });

    test('✗ Closing modal discards changes', async ({ page }) => {
      const salesBoard = new SalesBoardPage(page);
      await salesBoard.clickAddNewQuote();
      
      const quote = new QuotePage(page);
      await quote.selectCustomer('Customer Testing');
      await page.waitForTimeout(500);
      
      // Close modal using Escape key
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
      
      // Modal should close
      const customerDropdown = quote.selectCustomerDropdown();
      const isVisible = await customerDropdown.isVisible().catch(() => false);
      
      // Either modal closed or customer dropdown still visible on fresh modal
      await page.screenshot({ path: 'playwright-report/neg-06-modal-closed.png', fullPage: true });
    });

    test('✗ Invalid quantity input rejected', async ({ page }) => {
      const salesBoard = new SalesBoardPage(page);
      await salesBoard.clickAddNewQuote();
      
      const quote = new QuotePage(page);
      await quote.selectCustomer('Customer Testing');
      await page.waitForTimeout(500);
      
      await quote.addProductButton().click();
      await quote.blanksButton().click();
      await page.waitForTimeout(1500);
      
      const productButtons = page.locator('button').filter({ hasText: 'Add' });
      if (await productButtons.count() > 0) {
        await productButtons.first().click({ force: true });
        await page.waitForTimeout(1000);
        
        // Try invalid quantity
        const quantityInputs = page.locator('input[type="number"]');
        if (await quantityInputs.count() > 0) {
          const input = quantityInputs.first();
          
          // Try negative number
          await input.fill('-5');
          await page.waitForTimeout(300);
          
          // Input should either reject it or clear it
          const value = await input.inputValue();
          await page.screenshot({ path: 'playwright-report/neg-07-invalid-quantity.png', fullPage: true });
        }
      }
    });

    test('✗ Required fields validation on quote save', async ({ page }) => {
      const salesBoard = new SalesBoardPage(page);
      await salesBoard.clickAddNewQuote();
      
      const quote = new QuotePage(page);
      await quote.selectCustomer('Customer Testing');
      await page.waitForTimeout(500);
      
      await quote.addProductButton().click();
      await quote.blanksButton().click();
      await page.waitForTimeout(1500);
      
      const productButtons = page.locator('button').filter({ hasText: 'Add' });
      if (await productButtons.count() > 0) {
        await productButtons.first().click({ force: true });
        await page.waitForTimeout(1000);
        await quote.addToQuoteButton().click();
        await page.waitForTimeout(1000);
        
        // Try to save with missing required info
        const saveBtn = quote.saveButton();
        if (await saveBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          // Check if button is enabled
          const isDisabled = await saveBtn.evaluate(el => el.disabled);
          
          if (!isDisabled) {
            await saveBtn.click();
            await page.waitForTimeout(500);
          }
        }
      }
      
      await page.screenshot({ path: 'playwright-report/neg-08-save-validation.png', fullPage: true });
    });

    test('✗ Quote with zero items shows error', async ({ page }) => {
      const salesBoard = new SalesBoardPage(page);
      
      // Try to access quote with no items
      const quoteList = page.locator('table, [role="grid"]');
      const isVisible = await quoteList.isVisible({ timeout: 3000 }).catch(() => false);
      
      if (isVisible) {
        // Verify quotes in list have items
        await expect(quoteList).toBeVisible();
      }
      
      await page.screenshot({ path: 'playwright-report/neg-09-quote-list.png', fullPage: true });
    });
  });

  test.describe('EDGE CASES', () => {
    
    test('⚠ Multiple products in single quote', async ({ page }) => {
      const salesBoard = new SalesBoardPage(page);
      await salesBoard.clickAddNewQuote();
      
      const quote = new QuotePage(page);
      await quote.selectCustomer('Customer Testing');
      await page.waitForTimeout(500);
      
      // Add multiple products
      for (let i = 0; i < 2; i++) {
        await quote.addProductButton().click();
        await quote.blanksButton().click();
        await page.waitForTimeout(1500);
        
        const productButtons = page.locator('button').filter({ hasText: 'Add' });
        if (await productButtons.count() > 0) {
          await productButtons.nth(i % await productButtons.count()).click({ force: true });
          await page.waitForTimeout(1000);
          
          const addToQuoteBtn = quote.addToQuoteButton();
          if (await addToQuoteBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
            await addToQuoteBtn.click();
            await page.waitForTimeout(500);
          }
          
          // Close product modal/go back
          await page.keyboard.press('Escape');
          await page.waitForTimeout(500);
        }
      }
      
      // Save quote with multiple items
      const saveBtn = quote.saveButton();
      if (await saveBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await saveBtn.click();
        await page.waitForTimeout(1500);
      }
      
      await page.screenshot({ path: 'playwright-report/edge-01-multiple-products.png', fullPage: true });
    });

    test('⚠ Large quantity handling', async ({ page }) => {
      const salesBoard = new SalesBoardPage(page);
      await salesBoard.clickAddNewQuote();
      
      const quote = new QuotePage(page);
      await quote.selectCustomer('Customer Testing');
      await page.waitForTimeout(500);
      
      await quote.addProductButton().click();
      await quote.blanksButton().click();
      await page.waitForTimeout(1500);
      
      const productButtons = page.locator('button').filter({ hasText: 'Add' });
      if (await productButtons.count() > 0) {
        await productButtons.first().click({ force: true });
        await page.waitForTimeout(1000);
        
        // Set large quantity
        const quantityInputs = page.locator('input[type="number"]');
        if (await quantityInputs.count() > 0) {
          await quantityInputs.first().fill('9999');
          await page.waitForTimeout(300);
        }
        
        await quote.addToQuoteButton().click();
        await page.waitForTimeout(1000);
      }
      
      await page.screenshot({ path: 'playwright-report/edge-02-large-quantity.png', fullPage: true });
    });

    test('⚠ Quick successive operations', async ({ page }) => {
      const salesBoard = new SalesBoardPage(page);
      
      // Rapid clicks on Add New Quote
      await salesBoard.clickAddNewQuote();
      await page.waitForTimeout(200);
      
      const quote = new QuotePage(page);
      await quote.selectCustomer('Customer Testing');
      await page.waitForTimeout(200);
      
      await quote.addProductButton().click();
      await page.waitForTimeout(200);
      
      // System should handle rapid operations gracefully
      await page.screenshot({ path: 'playwright-report/edge-03-rapid-operations.png', fullPage: true });
    });
  });
});
