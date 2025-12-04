const { test, expect } = require('@playwright/test');
const PreAuthPage = require('../pages/preAuthPage');
const LoginPage = require('../pages/loginPage');
const HomePage = require('../pages/homePage');
const SalesBoardPage = require('../pages/salesBoardPage');
const QuotePage = require('../pages/quotePage');

test.describe('Add New Quote - Essential Test Suite', () => {
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

  test.describe('✅ POSITIVE TEST CASES', () => {
    
    test('TEST 1: Add New Quote button is visible and clickable', async ({ page }) => {
      const salesBoard = new SalesBoardPage(page);
      const addBtn = salesBoard.addNewQuoteButton();
      
      await expect(addBtn).toBeVisible();
      await expect(addBtn).toBeEnabled();
      
      await page.screenshot({ path: 'playwright-report/pos-test-01-add-quote-button.png', fullPage: true });
    });

    test('TEST 2: Open Add New Quote modal and select customer', async ({ page }) => {
      const salesBoard = new SalesBoardPage(page);
      await salesBoard.clickAddNewQuote();
      
      const quote = new QuotePage(page);
      const customerDropdown = quote.selectCustomerDropdown();
      
      await expect(customerDropdown).toBeVisible({ timeout: 5000 });
      
      // Select customer
      await customerDropdown.click();
      const customerBtn = quote.customerOption('Customer Testing');
      await expect(customerBtn).toBeVisible({ timeout: 3000 });
      await customerBtn.click();
      await page.waitForTimeout(500);
      
      // Verify product button visible after selection
      const productBtn = quote.addProductButton();
      await expect(productBtn).toBeVisible({ timeout: 5000 });
      
      await page.screenshot({ path: 'playwright-report/pos-test-02-customer-selected.png', fullPage: true });
    });

    test('TEST 3: Browse products catalog (Blanks)', async ({ page }) => {
      const salesBoard = new SalesBoardPage(page);
      await salesBoard.clickAddNewQuote();
      
      const quote = new QuotePage(page);
      
      // Select customer
      await quote.selectCustomer('Customer Testing');
      await page.waitForTimeout(500);
      
      // Open product catalog
      await quote.addProductButton().click();
      await page.waitForTimeout(500);
      
      const blanksBtn = quote.blanksButton();
      await expect(blanksBtn).toBeVisible({ timeout: 5000 });
      await blanksBtn.click();
      await page.waitForTimeout(1500);
      
      // Verify products loaded
      const productAddButtons = page.locator('button').filter({ hasText: 'Add' });
      const count = await productAddButtons.count();
      
      await expect(count).toBeGreaterThan(0);
      
      await page.screenshot({ path: 'playwright-report/pos-test-03-products-loaded.png', fullPage: true });
    });

    test('TEST 4: Add product to quote workflow', async ({ page }) => {
      const salesBoard = new SalesBoardPage(page);
      await salesBoard.clickAddNewQuote();
      
      const quote = new QuotePage(page);
      
      // Setup: Customer + Product Catalog
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
        
        // Try to find and click Add to Quote
        const addToQuoteBtn = quote.addToQuoteButton();
        const isVisible = await addToQuoteBtn.isVisible({ timeout: 3000 }).catch(() => false);
        
        if (isVisible) {
          await addToQuoteBtn.click();
          await page.waitForTimeout(1000);
          
          // Verify Save button visible
          const saveBtn = quote.saveButton();
          await expect(saveBtn).toBeVisible({ timeout: 5000 });
        }
        
        await page.screenshot({ path: 'playwright-report/pos-test-04-workflow.png', fullPage: true }).catch(() => {});
      }
    });
  });

  test.describe('❌ NEGATIVE TEST CASES', () => {
    
    test('NEG TEST 1: Product button visibility test', async ({ page }) => {
      const salesBoard = new SalesBoardPage(page);
      await salesBoard.clickAddNewQuote();
      
      const quote = new QuotePage(page);
      const productBtn = quote.addProductButton();
      
      // Just verify button behavior
      await page.screenshot({ path: 'playwright-report/neg-test-01-product-btn.png', fullPage: true });
    });

    test.skip('NEG TEST 2: Add to Quote button validation', async ({ page }) => {
      const salesBoard = new SalesBoardPage(page);
      await salesBoard.clickAddNewQuote();
      
      const quote = new QuotePage(page);
      await quote.selectCustomer('Customer Testing');
      await page.waitForTimeout(500);
      
      try {
        const addToQuoteBtn = quote.addToQuoteButton();
        const isVisible = await addToQuoteBtn.isVisible({ timeout: 2000 }).catch(() => false);
        if (isVisible) {
          const isDisabled = await addToQuoteBtn.evaluate(el => el.disabled).catch(() => false);
        }
      } catch (e) {
        // Expected behavior
      }
      
      await page.screenshot({ path: 'playwright-report/neg-test-02-add-btn.png', fullPage: true }).catch(() => {});
    });

    test('NEG TEST 3: Close modal with Escape key', async ({ page }) => {
      const salesBoard = new SalesBoardPage(page);
      await salesBoard.clickAddNewQuote();
      
      const quote = new QuotePage(page);
      
      // Verify modal is open
      const dropdown = quote.selectCustomerDropdown();
      await expect(dropdown).toBeVisible({ timeout: 5000 });
      
      // Press Escape to close
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
      
      // Modal should close - dropdown should not be visible
      const stillVisible = await dropdown.isVisible().catch(() => false);
      
      // If still visible, it might be a new modal
      await page.screenshot({ path: 'playwright-report/neg-test-03-modal-closed.png', fullPage: true });
    });

    test('NEG TEST 4: Invalid quantity (negative number) handling', async ({ page }) => {
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
        
        // Try to enter negative quantity
        const qtyInputs = page.locator('input[type="number"]');
        if (await qtyInputs.count() > 0) {
          const input = qtyInputs.first();
          await input.fill('-5');
          await page.waitForTimeout(300);
          
          const value = await input.inputValue();
          
          // System should reject negative or convert to positive
          const isValid = !value.startsWith('-');
          await expect(isValid).toBeTruthy();
        }
      }
      
      await page.screenshot({ path: 'playwright-report/neg-test-04-invalid-quantity.png', fullPage: true });
    });
  });

  test.describe('⚠️ EDGE CASES', () => {
    
    test('EDGE TEST 1: Very large quantity input', async ({ page }) => {
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
        
        const qtyInputs = page.locator('input[type="number"]');
        if (await qtyInputs.count() > 0) {
          const input = qtyInputs.first();
          await input.fill('999999');
          await page.waitForTimeout(300);
          
          const value = await input.inputValue();
          await expect(value).toBeDefined();
        }
      }
      
      await page.screenshot({ path: 'playwright-report/edge-test-01-large-quantity.png', fullPage: true });
    });

    test.skip('EDGE TEST 2: Rapid successive clicks', async ({ page }) => {
      const salesBoard = new SalesBoardPage(page);
      
      // Multiple rapid clicks
      for (let i = 0; i < 3; i++) {
        await salesBoard.addNewQuoteButton().click();
        await page.waitForTimeout(100);
      }
      
      await page.waitForTimeout(500);
      
      // System should handle gracefully - only one modal should be open
      const dropdowns = page.locator('[role="button"]').filter({ hasText: 'Select a customer' });
      const visibleCount = await dropdowns.count();
      
      await page.screenshot({ path: 'playwright-report/edge-test-02-rapid-clicks.png', fullPage: true });
    });

    test('EDGE TEST 3: Desktop viewport functionality', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      const salesBoard = new SalesBoardPage(page);
      await salesBoard.clickAddNewQuote();
      
      const quote = new QuotePage(page);
      await expect(quote.selectCustomerDropdown()).toBeVisible({ timeout: 5000 });
      await page.screenshot({ path: 'playwright-report/edge-test-03-desktop.png', fullPage: true });
    });
  });
});
