const { test, expect } = require('@playwright/test');

test.describe('Printools Login Flow (Codegen)', () => {
  const baseUrl = process.env.BASE_URL || 'https://printools.io/';
  const prePass = process.env.PRE_PASS || 'angel123';
  const email = process.env.TEST_USER || 'testing23@mailinator.com';
  const password = process.env.TEST_PASS || 'Test@1234';

  test('Complete login and logout flow', async ({ page }) => {
    // Navigate to site
    await page.goto(baseUrl);

    // Handle pre-auth password
    await page.getByRole('textbox', { name: 'Password' }).fill(prePass);
    await page.getByRole('button', { name: 'Access Page' }).click();

    // Click dashboard link
    await page.getByRole('link', { name: 'Go to Dashboard' }).click();

    // Fill login form
    await page.getByRole('textbox', { name: 'Email Address' }).fill(email);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('button', { name: 'LOG IN' }).click();

    // Verify logged in - profile button visible
    await expect(page.getByRole('button', { name: /UN Printing|Sign Out/i })).toBeVisible({ timeout: 10000 });

    // Logout
    const profileBtn = page.getByRole('button', { name: 'UN Printing 1 UN Printing 1' });
    if (await profileBtn.isVisible()) {
      await profileBtn.click();
    }
    await page.getByRole('button', { name: 'Sign Out' }).click();

    // Verify logged out - back to login form
    await expect(page.getByRole('textbox', { name: 'Email Address' })).toBeVisible({ timeout: 5000 });
  });
});
