const { test, expect } = require('@playwright/test');

test.describe('Sales Board - Add New Quote (Codegen)', () => {
  
  test('Complete Add New Quote Flow - Kids Shirts', async ({ page }) => {
    test.setTimeout(90000); // Increase timeout to 90s
    
    // Pre-auth and Login
    await page.goto('https://printools.io/');
    await page.getByRole('textbox', { name: 'Password' }).fill('angel123');
    await page.getByRole('button', { name: 'Access Page' }).click();
    await page.getByRole('link', { name: 'Go to Dashboard' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).fill('testing23@mailinator.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('Test@1234');
    await page.getByRole('button', { name: 'LOG IN' }).click();
    
    // Wait for dashboard
    await page.waitForTimeout(2000);
    
    // Sales Board - Add New Quote
    await page.getByRole('link', { name: 'Sales Board' }).click();
    await page.waitForTimeout(1000);
    
    await page.getByRole('button', { name: 'Add New Quote' }).click();
    await page.waitForTimeout(1000);
    
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
    
    await page.getByRole('textbox', { name: '0', exact: true }).nth(4).click();
    await page.getByRole('textbox', { name: '0', exact: true }).nth(4).fill('5');
    await page.waitForTimeout(300);
    
    await page.getByRole('combobox').nth(4).click();
    await page.waitForTimeout(300);
    await page.getByRole('option', { name: 'M', exact: true }).click();
    await page.waitForTimeout(300);
    
    await page.getByRole('combobox').nth(3).click();
    await page.waitForTimeout(300);
    await page.getByLabel('GRAY').locator('div').filter({ hasText: 'GRAY' }).click();
    await page.waitForTimeout(500);
    
    await page.getByRole('button', { name: 'Duplicate' }).nth(1).click();
    await page.waitForTimeout(500);
    
    await page.getByRole('combobox').nth(5).click();
    await page.waitForTimeout(300);
    await page.getByRole('option', { name: 'PMS 162C PINK' }).click();
    await page.waitForTimeout(300);
    
    await page.getByRole('combobox').filter({ hasText: 'M' }).nth(1).click();
    await page.waitForTimeout(300);
    await page.getByRole('option', { name: 'L', exact: true }).click();
    await page.waitForTimeout(500);
    
    await page.getByRole('button', { name: 'Add to Quote' }).click();
    await page.waitForTimeout(1000);
    
    await page.getByRole('button', { name: 'Save' }).nth(2).click();
    await page.waitForTimeout(1000);
    
    await page.getByRole('switch').first().click();
    await page.waitForTimeout(500);
    
    await page.getByRole('button', { name: '3 days' }).click();
    await page.waitForTimeout(500);
    
    await page.getByRole('button', { name: 'Send Quote' }).click();
    await page.waitForTimeout(2000);
    
    // Verify quote sent successfully
    await expect(page.getByRole('button', { name: 'Actions' }).first()).toBeVisible({ timeout: 10000 });
    await page.screenshot({ path: 'playwright-report/quote-sent-success.png', fullPage: true });
    
    await page.getByRole('button', { name: 'Actions' }).first().click();
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: 'Approve', exact: true }).click();
    await page.waitForTimeout(2000);
    
    // Verify approved
    await page.screenshot({ path: 'playwright-report/quote-approved.png', fullPage: true });
    
    await page.getByRole('button', { name: 'Actions' }).first().click();
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: 'Add to Job' }).click();
    await page.waitForTimeout(2000);
    
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
    
    // Verify product catalog opened
    await expect(page.locator('div').filter({ hasText: /^Kids ShirtsCode: S9018Partner: ARTS SPOT\$9\.99$/ }).nth(1)).toBeVisible({ timeout: 5000 });
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
