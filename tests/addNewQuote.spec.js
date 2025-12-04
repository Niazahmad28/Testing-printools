const { test, expect } = require('@playwright/test');

test.describe('Sales Board - Add New Quote (Codegen)', () => {
  
  test.skip('Complete Add New Quote Flow - Single Item (WIP)', async ({ page }) => {
    test.setTimeout(90000); // 90 second timeout - longer for all steps
    
    // Pre-auth and Login
    await page.goto('https://printools.io/');
    await page.getByRole('textbox', { name: 'Password' }).fill('angel123');
    await page.getByRole('button', { name: 'Access Page' }).click();
    await page.getByRole('link', { name: 'Go to Dashboard' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).fill('testing23@mailinator.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('Test@1234');
    await page.getByRole('button', { name: 'LOG IN' }).click();
    await page.waitForTimeout(2000);
    
    // Navigate to Sales Board
    await page.getByRole('link', { name: 'Sales Board' }).click();
    await page.waitForTimeout(1500);
    
    await page.getByRole('button', { name: 'Add New Quote' }).click();
    await page.waitForTimeout(1000);
    
    // Select customer
    await page.getByRole('button', { name: 'Select a customer...' }).first().click();
    await page.getByRole('button', { name: 'Customer Testing' }).click();
    await page.waitForTimeout(500);
    
    // Click add product button
    await page.locator('.group.relative.border.border-border\\/30.rounded-lg.transition-all.duration-200.hover\\:shadow-md.cursor-pointer.hover\\:border-emerald-300.hover\\:bg-emerald-50\\/30.bg-gradient-to-r.from-green-50\\/50 > .absolute.-top-2 > .bg-emerald-500 > .lucide').click();
    await page.waitForTimeout(500);
    
    // Open Blanks catalog
    await page.getByRole('button', { name: 'Blanks Select blanks from' }).click();
    await page.waitForTimeout(1500);
    
    // Select first product (with force click to bypass overlays)
    const productButtons = await page.locator('button').filter({ hasText: 'Add' });
    if (await productButtons.count() > 0) {
      await productButtons.first().click({ force: true });
      await page.waitForTimeout(1500);
    }
    
    // Configure and add item  - use type number inputs
    const numInputs = await page.locator('input[type="number"]');
    if (await numInputs.count() > 0) {
      await numInputs.first().fill('2');
      await page.waitForTimeout(300);
    }
    
    // Add to quote
    await page.getByRole('button', { name: 'Add to Quote' }).click();
    await page.waitForTimeout(1500);
    
    // Save quote configuration
    await page.getByRole('button', { name: 'Save' }).nth(2).click();
    await page.waitForTimeout(1500);
    
    // Enable switch
    const switchButton = page.getByRole('switch').first();
    if (await switchButton.isEnabled()) {
      await switchButton.click();
      await page.waitForTimeout(1000);
    }
    
    // Set delivery days - click the 3 days button with force
    try {
      await page.getByRole('button', { name: '3 days' }).click({ timeout: 5000 });
    } catch (e) {
      // If 3 days not found, try other day options
      const dayButtons = page.getByText(/\d+\s*days?/);
      if (await dayButtons.count() > 0) {
        await dayButtons.first().click({ force: true });
      }
    }
    await page.waitForTimeout(500);
    
    // Send quote
    await page.getByRole('button', { name: 'Send Quote' }).click();
    await page.waitForTimeout(2000);
    
    // Verify quote sent
    await expect(page.getByRole('button', { name: 'Actions' }).first()).toBeVisible({ timeout: 5000 });
    await page.screenshot({ path: 'playwright-report/quote-sent-success.png', fullPage: true });
    
    // Approve quote
    await page.getByRole('button', { name: 'Actions' }).first().click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Approve', exact: true }).click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'playwright-report/quote-approved.png', fullPage: true });
    
    // Add to job
    await page.getByRole('button', { name: 'Actions' }).first().click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Add to Job' }).click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'playwright-report/quote-added-to-job.png', fullPage: true });
  });

  test('Add Quote - Navigate to Sales Board', async ({ page }) => {
    await page.goto('https://printools.io/');
    await page.getByRole('textbox', { name: 'Password' }).fill('angel123');
    await page.getByRole('button', { name: 'Access Page' }).click();
    await page.getByRole('link', { name: 'Go to Dashboard' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).fill('testing23@mailinator.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('Test@1234');
    await page.getByRole('button', { name: 'LOG IN' }).click();
    
    await page.getByRole('link', { name: 'Sales Board' }).click();
    
    // Verify Sales Board page loaded
    await expect(page.getByRole('button', { name: 'Add New Quote' })).toBeVisible({ timeout: 5000 });
    await page.screenshot({ path: 'playwright-report/sales-board-page.png', fullPage: true });
  });

  test('Add Quote - Customer Selection', async ({ page }) => {
    await page.goto('https://printools.io/');
    await page.getByRole('textbox', { name: 'Password' }).fill('angel123');
    await page.getByRole('button', { name: 'Access Page' }).click();
    await page.getByRole('link', { name: 'Go to Dashboard' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).fill('testing23@mailinator.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('Test@1234');
    await page.getByRole('button', { name: 'LOG IN' }).click();
    await page.getByRole('link', { name: 'Sales Board' }).click();
    await page.getByRole('button', { name: 'Add New Quote' }).click();
    
    // Select customer
    await page.getByRole('button', { name: 'Select a customer...' }).first().click();
    await page.getByRole('button', { name: 'Customer Testing' }).click();
    
    // Verify customer selected (product selection should be available)
    await expect(page.locator('.group.relative.border.border-border\\/30.rounded-lg.transition-all.duration-200.hover\\:shadow-md.cursor-pointer.hover\\:border-emerald-300.hover\\:bg-emerald-50\\/30.bg-gradient-to-r.from-green-50\\/50 > .absolute.-top-2 > .bg-emerald-500 > .lucide')).toBeVisible({ timeout: 5000 });
    await page.screenshot({ path: 'playwright-report/customer-selected.png', fullPage: true });
  });

  test('Add Quote - Product Selection', async ({ page }) => {
    await page.goto('https://printools.io/');
    await page.getByRole('textbox', { name: 'Password' }).fill('angel123');
    await page.getByRole('button', { name: 'Access Page' }).click();
    await page.getByRole('link', { name: 'Go to Dashboard' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).fill('testing23@mailinator.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('Test@1234');
    await page.getByRole('button', { name: 'LOG IN' }).click();
    await page.getByRole('link', { name: 'Sales Board' }).click();
    await page.getByRole('button', { name: 'Add New Quote' }).click();
    await page.getByRole('button', { name: 'Select a customer...' }).first().click();
    await page.getByRole('button', { name: 'Customer Testing' }).click();
    
    // Click add product button
    await page.locator('.group.relative.border.border-border\\/30.rounded-lg.transition-all.duration-200.hover\\:shadow-md.cursor-pointer.hover\\:border-emerald-300.hover\\:bg-emerald-50\\/30.bg-gradient-to-r.from-green-50\\/50 > .absolute.-top-2 > .bg-emerald-500 > .lucide').click();
    await page.getByRole('button', { name: 'Blanks Select blanks from' }).click();
    
    // Verify product catalog opened - check for any product button
    const productCount = await page.locator('button').filter({ hasText: 'Add' }).count();
    await expect(productCount).toBeGreaterThan(0);
    await page.screenshot({ path: 'playwright-report/product-catalog.png', fullPage: true });
  });

  test('Add Quote - Item Configuration', async ({ page }) => {
    await page.goto('https://printools.io/');
    await page.getByRole('textbox', { name: 'Password' }).fill('angel123');
    await page.getByRole('button', { name: 'Access Page' }).click();
    await page.getByRole('link', { name: 'Go to Dashboard' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).fill('testing23@mailinator.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('Test@1234');
    await page.getByRole('button', { name: 'LOG IN' }).click();
    await page.waitForTimeout(1000);
    
    await page.getByRole('link', { name: 'Sales Board' }).click();
    await page.waitForTimeout(1000);
    
    await page.getByRole('button', { name: 'Add New Quote' }).click();
    await page.waitForTimeout(500);
    
    await page.getByRole('button', { name: 'Select a customer...' }).first().click();
    await page.getByRole('button', { name: 'Customer Testing' }).click();
    await page.waitForTimeout(500);
    
    await page.locator('.group.relative.border.border-border\\/30.rounded-lg.transition-all.duration-200.hover\\:shadow-md.cursor-pointer.hover\\:border-emerald-300.hover\\:bg-emerald-50\\/30.bg-gradient-to-r.from-green-50\\/50 > .absolute.-top-2 > .bg-emerald-500 > .lucide').click();
    await page.waitForTimeout(500);
    
    await page.getByRole('button', { name: 'Blanks Select blanks from' }).click();
    await page.waitForTimeout(1000);
    
    await page.locator('div').filter({ hasText: /^Kids ShirtsCode: S9018Partner: ARTS SPOT\$9\.99$/ }).nth(1).click();
    await page.waitForTimeout(1000);
    
    await page.getByRole('button', { name: 'Duplicate' }).click();
    await page.waitForTimeout(500);
    
    // Configure quantity and size
    const qtyInput = page.getByRole('textbox', { name: '0', exact: true }).nth(4);
    await qtyInput.fill('3');
    await page.waitForTimeout(300);
    
    // Verify quantity filled
    await expect(qtyInput).toHaveValue('3');
    
    await page.getByRole('combobox').nth(4).click();
    await page.waitForTimeout(300);
    await page.getByRole('option', { name: 'S', exact: true }).click();
    await page.waitForTimeout(500);
    
    await page.screenshot({ path: 'playwright-report/item-configured.png', fullPage: true });
  });
});
